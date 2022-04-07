import { DataTable, Text } from 'grommet';
import {useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AnaestheticTable = ({ patient_id }) => {
  const navigate = useNavigate();

  const[patientAnaesthetics, setPatientAnaesthetics] = useState([]);

  // Fetch patient's anaesthetic data from server
  useEffect(() => {
    const fetchData = async () => {
      const get_anaesthetics_url = `${process.env.REACT_APP_API_END_POINT}/api/anaesthetic/${patient_id}`;

      // Attempt to fetch patient's anaesthetics
      try {
        await axios.get(get_anaesthetics_url, {
          headers: {
            'token': localStorage.token
          }
        }).then(res => {
          // Success: set patients state
          let anaesthetics = res.data;
          anaesthetics.forEach(element => {
            element.anaesthetic_date_f = new Date(element.anaesthetic_date).toLocaleDateString("en-IE");
          });
           setPatientAnaesthetics(anaesthetics);
        });

      } catch (error) {
        setPatientAnaesthetics([]);
        console.error(error.message);
      }
    }

    if(patient_id) {
      fetchData();
    }
  }, [patient_id]);

  return (
    <DataTable
      columns={[{
          header: <Text color="white" weight="bold">Date</Text>, 
          primary: true, property: "anaesthetic_date_f"
        }, {
          header: <Text color="white" weight="bold">Staff Member</Text>,
          property: "staff_username"
        }
      ]}
      data={patientAnaesthetics} 
      pad="small"
      background={{"header":{"color":"brand"}}} 
      border="horizontal"
      margin={{"top": "small"}}
      fill="horizontal"
      step={8}
      onClickRow={({ datum }) => {navigate(`/anaesthetic/${datum.anaesthetic_id}`)}}
      paginate
    />
  )
}

export default AnaestheticTable
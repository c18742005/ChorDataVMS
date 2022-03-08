import { DataTable, Text } from 'grommet';
import { useEffect, useState } from 'react';
import axios from 'axios';

const DrugLogTable = ({ drugId, clinicId }) => {
  // set state values for drug log
  const [drugLog, setDrugLog] = useState([]);

  // Fetch drug log data
  useEffect(() => {
    const fetch_data = async () => {
      const url = `${process.env.REACT_APP_API_END_POINT}/api/drugs/log/${drugId}/${clinicId}`;

      await axios.get(url, {
          headers: {
            'token': localStorage.token
          }
        }
      ).then(res => {
        // Success: Format date and set drug log state
        const drug = res.data;
        drug.forEach(element => {
          element.drug_date_administered = new Date(element.drug_date_administered).toLocaleDateString("en-US");
        });
       
        setDrugLog(drug);
      })
    }

    fetch_data();
  }, [drugId]);

  return (
    <DataTable
      columns={[{
          header: <Text color="white" weight="bold">Date</Text>, 
          primary: true, property: "drug_date_administered"
        }, {
          header: <Text color="white" weight="bold">Quantity Given</Text>, 
          property: "drug_quantity_given"
        }, {
          header: <Text color="white" weight="bold">Measure</Text>, 
          property: "drug_quantity_measure"
        }, {
          header: <Text color="white" weight="bold">Patient</Text>,
          property: "patient_name", 
        }, {
          header: <Text color="white" weight="bold">Batch #</Text>,
          property: "drug_batch_id", 
        }, {
          header: <Text color="white" weight="bold">Staff Member</Text>,
          property: "staff_username"
        }
      ]}
      data={drugLog} 
      pad="small"
      background={{
        "header":{"color":"brand"},
        "body":["white", "border"]
      }} 
      margin={{"top": "small"}}
      fill="horizontal"
      step={10}
      paginate
      sortable
      resizeable 
    />
  )
}

export default DrugLogTable
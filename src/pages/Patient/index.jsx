import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Box, 
  Button, 
  DataTable, 
  Heading, 
  NameValueList, 
  NameValuePair, 
  Pagination, 
  Tab, 
  Tabs, 
  Text } from 'grommet';
import { 
  Checkmark, 
  CircleInformation, 
  Close, 
  Edit } from 'grommet-icons';

// Components
import EditPatientModal from '../../components/EditPatientModal';
import WarningModal from '../../components/WarningModal';

const Patient = () => {
  const { patientId } = useParams();
  const [showPatientEdit, setShowPatientEdit] = useState(false);
  const [showPatientDeactivate, setShowPatientDeactivate] = useState(false);
  const [patient, setPatient] = useState({});

  const closeForms = () => {
    setShowPatientEdit(false);
    setShowPatientDeactivate(false);
  }

  const updatePatient = (newData) => {
    setPatient(newData);
  }

  const updateActiveState = (reason=null) => {
    setPatient({...patient, 
      patient_inactive: !patient.patient_inactive,
      patient_reason_inactive: reason
    })
  }

  // Fetch patient data
  useEffect(() => {
    const fetch_data = async () => {
      const patient_url = `${process.env.REACT_APP_API_END_POINT}/api/patients/${patientId}`;

      try {
        await axios.get(
          patient_url,
          {
            headers: {
              'token': localStorage.token
          }}
        )
          .then(res => {
            const patient_data = res.data;
            setPatient(patient_data[0]);
          })
          .catch(e => console.log(e.response.data));
      } catch(err) {
        console.log(err);
      }
    }
   
    fetch_data();
  }, []);

  // Function to handle the reactivation of a patient acc
  const onReactivation = async e => {
    const reactivate_patient_url = `${process.env.REACT_APP_API_END_POINT}/api/patients/reactivate/${patientId}`;

    // Try to send user data to the server 
    try {
      await axios.put(
        reactivate_patient_url,
        {
          headers: {
            'token': localStorage.token
        }}
      )
      .then((response) => {
        updateActiveState();
        toast.success(response.data.message);
      }, (error) => {
        toast.error(error.message);
      });   
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <Box align="start" justify="start" direction="column" pad="small" fill>
      <Heading level="2" textAlign="center" color={patient.patient_inactive ? "border" : "black"}>
        {patient.patient_name}
      </Heading>
      {patient.patient_inactive && (
        <Heading level="4" textAlign="center" color="red" margin="none" gap="none">
          {`Patient is deactivated: ${patient.patient_reason_inactive}`}
        </Heading>)
      }
      <Tabs justify="start" fill="horizontal">
        <Tab 
          title="Info" 
          icon={<CircleInformation />} 
          reverse
        >
          <Box 
            align="start" 
            justify="start" 
            fill="horizontal" 
            direction="column" 
            border={{"color":"border"}} 
            round="small" 
            elevation="medium" 
            gap="none" 
            margin={{"top":"medium"}}
          >
            <NameValueList layout="column" margin={{"left":"medium"}}>
              <NameValuePair name="Species:">
                <Text color="text-strong">{patient.patient_species}</Text>
              </NameValuePair>
              <NameValuePair name="Breed:">
                <Text color="text-strong">{patient.patient_breed}</Text>
              </NameValuePair>
              <NameValuePair name="Age:">
                <Text color="text-strong">{patient.patient_age}</Text>
              </NameValuePair>
              <NameValuePair name="Sex:">
                <Text color="text-strong">{patient.patient_sex}</Text>
              </NameValuePair>
              <NameValuePair name="Color:">
                <Text color="text-strong">{patient.patient_color}</Text>
              </NameValuePair>
              <NameValuePair name="Microchip Number:">
                <Text color="text-strong">{patient.patient_microchip}</Text>
              </NameValuePair>
            </NameValueList>
          </Box>
        </Tab>
        <Tab title="History">
          <Box 
            align="end" 
            justify="center" 
            fill="horizontal" 
            direction="column" 
            border={{"color":"border"}} 
            round="small" 
            elevation="medium" 
            pad="medium" 
            gap="small" 
            margin={{"top":"medium"}}
          >
            <DataTable
              columns={[
                {header:<Text color="white" weight="bold">Procedure</Text>, property: "procedure", primary: true},
                {header:<Text color="white" weight="bold">Date</Text>, property: "date"}
              ]}
              data={[
                {
                  "procedure": "Anaesthetic Monitoring",
                  "date": "02/02/2022"
                },
                {
                  "procedure": "Dental Chart",
                  "date": "01/01/2022"
                },
                {
                  "procedure": "X-Ray",
                  "date": "25/12/2021"
                },
                {
                  "procedure": "Drug Administered",
                  "date": "22/12/2021"
                },
                {
                  "procedure": "Drug Administered",
                  "date": "22/12/2021"
                }
              ]} 
              fill="horizontal"
              pad="small" 
              background={{"header":{"color":"brand"}}} 
              paginate 
              sortable 
              resizeable 
            />
            <Pagination size="small" numberItems={50} />
          </Box>
        </Tab>
        <Tab title="Other">
          <Box 
            align="start" 
            justify="center" 
            fill="horizontal" 
            direction="column" 
            border={{"color":"border"}} 
            round="small" 
            elevation="medium" 
            pad="medium" 
            gap="small" 
            margin={{"top":"medium"}}
          >
            {
              patient.patient_inactive ? (
                <Button 
                  label="Reactivate Patient" 
                  icon={<Checkmark />}
                  reverse 
                  primary 
                  size="medium" 
                  hoverIndicator
                  color="status-ok"
                  onClick={() => onReactivation()} 
                />) : (
                  <Button 
                  label="Deactivate Account" 
                  icon={<Close />} 
                  reverse 
                  primary 
                  size="medium" 
                  hoverIndicator={{"color":"neutral-4","dark":true}}   
                  color="status-critical" 
                  onClick={() => setShowPatientDeactivate(true)} 
                />
                )
            }
            <Button 
              label="Edit Patient" 
              icon={<Edit />} 
              size="medium" 
              color="accent-4" 
              hoverIndicator 
              reverse 
              primary 
              onClick={() => setShowPatientEdit(true)} />
          </Box>
        </Tab>
      </Tabs>
      {showPatientEdit && (
        <EditPatientModal 
          closeForm={closeForms} 
          data={patient} 
          patient={patientId} 
          updatePatient={updatePatient}
        />
      )}

      {showPatientDeactivate && (
        <WarningModal 
          closeForm={closeForms} 
          type="patient" 
          patientId={patientId} 
          changeActiveState={updateActiveState}
        />
      )}
    </Box>
  )
}

export default Patient
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
  Tab, 
  Tabs, 
  Text } from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircleInfo, faPencil, faXmark } from '@fortawesome/free-solid-svg-icons';

// Components
import EditPatientModal from '../../components/EditPatientModal';
import WarningModal from '../../components/WarningModal';

const Patient = () => {
  const { patientId } = useParams();

  // Set patient edit and deactivate modals (open/closed)
  const [showPatientEdit, setShowPatientEdit] = useState(false);
  const [showPatientDeactivate, setShowPatientDeactivate] = useState(false);
  // Store patient state
  const [patient, setPatient] = useState({});
  // Store patient history
  const [history, setHistory] = useState([]);

  // Function to close modals if open
  const closeForms = () => {
    setShowPatientEdit(false);
    setShowPatientDeactivate(false);
  }

  // Function to update patient state
  const updatePatient = (newData) => {
    setPatient(newData);
  }

  // Function to update the active state of the patient
  // If reason is not supplied then reason is set to null
  const updateActiveState = (reason=null) => {
    setPatient({...patient, 
      patient_inactive: !patient.patient_inactive,
      patient_reason_inactive: reason
    })
  }

  // Fetch patient data from the server
  useEffect(() => {
    const fetch_data = async () => {
      const patient_url = `${process.env.REACT_APP_API_END_POINT}/api/patients/${patientId}`;

      try {
        await axios.get(patient_url, {
          headers: {
            'token': localStorage.token
        }}).then(res => {
          // Success: set patient state to the patient retrieved
          const patient_data = res.data;
          setPatient(patient_data[0]);
        }).catch(e => console.log(e.response.data));
      } catch(err) {
        console.log(err);
      }
    }
   
    fetch_data();
  }, [patientId]);

  // Fetch patient clinical history from the server
  useEffect(() => {
    const fetch_history = async () => {
      const patient_history = `${process.env.REACT_APP_API_END_POINT}/api/patients/history/${patientId}`;

      try {
        await axios.get(patient_history, {
          headers: {
            'token': localStorage.token
        }}).then(res => {
          // Success: set history state to the patient history retrieved
          const history_data = res.data;

          // Format date to a string
          history_data.forEach(element => {
            element.date_completed_f = new Date(element.date_completed).toLocaleDateString("en-IE");
          });

          setHistory(history_data);
        }).catch(e => console.log(e.response.data));
      } catch(err) {
        console.log(err);
      }
    }
   
    fetch_history();
  }, [patientId]);

  // Function to handle the reactivation of a patient acc
  const onReactivation = async e => {
    const reactivate_patient_url = `${process.env.REACT_APP_API_END_POINT}/api/patients/reactivate/${patientId}`;

    // Try to update patient active state on the server 
    try {
      await axios.put(reactivate_patient_url, {
        headers: {
          'token': localStorage.token
      }}).then((response) => {
        // Success: Update the active state of the patient and send success message
        updateActiveState();
        toast.success(response.data.message);
      }, (error) => {
        // Error: Display error message to user
        toast.error(error.message);
      });   
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <Box align="start" justify="start" direction="column" pad="small" fill>
      <Heading 
        level="2" 
        textAlign="center" 
        color={patient.patient_inactive ? "border" : "black"}>
        {patient.patient_name}
      </Heading>
      {patient.patient_inactive && (
        <Heading 
          level="4" 
          textAlign="center" 
          color="red" 
          margin="none" 
          gap="none"
        >
          {`Patient is deactivated: ${patient.patient_reason_inactive}`}
        </Heading>)
      }
      <Tabs justify="start" fill="horizontal">
        <Tab 
          title="Info" 
          icon={<FontAwesomeIcon icon={faCircleInfo} />} 
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
              columns={[{ 
                header:<Text color="white" weight="bold">Procedure</Text>, 
                property: "vet_procedure", 
                primary: true
              }, {
                header:<Text color="white" weight="bold">Date</Text>, 
                property: "date_completed_f"
              }]}
              data={history} 
              fill="horizontal"
              pad="small" 
              background={{"header": {"color":"brand"}}} 
              step={10}
              paginate 
              sortable 
              resizeable 
            />
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
            { // Show reactivate button if patient is inactive
              // Show deactivate button if patient is active
              patient.patient_inactive ? (
                <Button 
                  label="Reactivate Patient" 
                  icon={<FontAwesomeIcon icon={faCheck} />}
                  reverse 
                  primary 
                  size="medium" 
                  hoverIndicator
                  color="status-ok"
                  onClick={() => onReactivation()} 
                />) : (
                  <Button 
                  label="Deactivate Account" 
                  icon={<FontAwesomeIcon icon={faXmark} />} 
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
              icon={<FontAwesomeIcon icon={faPencil} />} 
              size="medium" 
              color="accent-4" 
              disabled={patient.patient_inactive ? true : false}
              hoverIndicator 
              reverse 
              primary 
              onClick={() => setShowPatientEdit(true)} />
          </Box>
        </Tab>
      </Tabs>
      { // Show patient edit modal if selected
        showPatientEdit && (
        <EditPatientModal 
          closeForm={closeForms} 
          data={patient} 
          patient={patientId} 
          updatePatient={updatePatient}
        />
      )}

      { // Show patient deactivate modal if selected
        showPatientDeactivate && (
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
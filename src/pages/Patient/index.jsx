import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
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
import { CircleInformation, Close, Edit } from 'grommet-icons';

// Components
import EditPatientModal from '../../components/EditPatientModal';
import WarningModal from '../../components/WarningModal';

const Patient = () => {
  const { patientId } = useParams();
  const [showPatientEdit, setShowPatientEdit] = useState(false);
  const [showPatientDeactivate, setShowPatientDeactivate] = useState(false);
  const [patient, setPatient] = useState([]);

  const closeForms = () => {
    setShowPatientEdit(false);
    setShowPatientDeactivate(false);
  }

  // Fetch patient data
  useEffect(() => {
    const patient_url = `${process.env.REACT_APP_API_END_POINT}/api/patients/${patientId}`;

    axios.get(patient_url)
      .then(res => {
        const patient_data = res.data;
        setPatient(patient_data[0]);
      });
  }, []);

  return (
    <Box align="start" justify="start" direction="column" pad="small" fill>
      <Heading level="2" textAlign="center">
        {patient.patient_name}
      </Heading>
      <Tabs justify="start">
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
            <Button 
              label="Deactivate Patient" 
              icon={<Close />} 
              size="medium" 
              hoverIndicator={{"color":"neutral-4","dark":true}}   
              color="status-critical" 
              reverse 
              primary 
              onClick={() => setShowPatientDeactivate(true)} 
            />
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
        <EditPatientModal closeForm={closeForms} data={patient} patient={patientId} />
      )}

      {showPatientDeactivate && (
        <WarningModal closeForm={closeForms} type="patient" />
      )}
    </Box>
  )
}

export default Patient
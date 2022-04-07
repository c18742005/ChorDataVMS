import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { 
  faCheck, 
  faCircleInfo, 
  faPencil, 
  faPlus, 
  faUserSlash } from '@fortawesome/free-solid-svg-icons';

// Components
import EditClientModal from '../../components/EditClientModal';
import AddPatientModal from '../../components/AddPatientModal';
import WarningModal from '../../components/WarningModal';

const Client = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();

  // Set state of patient add, client edit, and deactivate modals
  const [showClientEdit, setShowClientEdit] = useState(false);
  const [showClientDeactivate, setShowClientDeactivate] = useState(false);
  const [showPatientAdd, setShowPatientAdd] = useState(false);

  // Set state of selected client
  const [client, setClient] = useState([]);
  // Set state of patients
  const [patients, setPatients] = useState([]);

  // Function to close modals
  const closeForms = () => {
    setShowClientEdit(false);
    setShowPatientAdd(false);
    setShowClientDeactivate(false);
  }

  // Function to update the client state
  const updateClient = (newData) => {
    setClient(newData);
  }

  // Function to update the patients state
  const updatePatients = (newPatient) => {
    setPatients([...patients, newPatient])
  }

  // Function to update the active state of a client
  const updateActiveState = (reason=null) => {
    setClient({...client, 
      client_inactive: !client.client_inactive,
      client_reason_inactive: reason
    })
  }

  // Fetch clients data from the server
  useEffect(() => {
    const fetch_data = async ()  => {
      const client_url = `${process.env.REACT_APP_API_END_POINT}/api/clients/${clientId}`;
      const patients_url = `${process.env.REACT_APP_API_END_POINT}/api/patients/client/${clientId}`;

      try {
        await axios.get(client_url, {
          headers: {
            'token': localStorage.token
        }}).then(res => {
          // Success: set client state
          const client_data = res.data;
          setClient(client_data);
        }).catch((e) => console.error(e.response.data));

        await axios.get(patients_url, {
          headers: {
            'token': localStorage.token
        }}).then(res => {
          // Success: set patients state
          const patient_data = res.data;
          setPatients(patient_data);
        }).catch((e) => console.error(e.response.data));

      } catch(err) {
        console.error(err);
      }
    }

    fetch_data();
  }, [clientId]);

  // Function to handle the reactivation of a client acc
  const onReactivation = async e => {
    const reactivate_client_url = `${process.env.REACT_APP_API_END_POINT}/api/clients/reactivate/${clientId}`;

    // Try to update active state on server
    try {
      axios.put(reactivate_client_url)
      .then((response) => {
        // Success: update active state of client
        updateActiveState();
        toast.success(response.data.message);
      }, (error) => {
        // Error: Display error to user
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
        color={client.client_inactive ? "border" : "black"}
      >
        {`${client.client_surname}, ${client.client_forename}`}
      </Heading>
      {client.client_inactive && (
        <Heading 
          level="4" 
          textAlign="center" 
          color="red" 
          margin="none" 
          gap="none"
        >
          {`Client is deactivated: ${client.client_reason_inactive}`}
        </Heading>)
      }
      <Tabs justify="start" fill="horizontal">
        <Tab title="Info" icon={<FontAwesomeIcon icon={faCircleInfo} />} reverse>
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
              <NameValuePair name="Address:">
                <Text color="text-strong">{`${client.client_address},`}</Text>
                <Text color="text-strong">{`${client.client_city},`}</Text>
                <Text color="text-strong">{client.client_county}</Text>
              </NameValuePair>
              <NameValuePair name="Phone Number:">
                <Text color="text-strong">{client.client_phone}</Text>
              </NameValuePair>
              <NameValuePair name="Email Address:">
                <Text color="text-strong">{client.client_email}</Text>
              </NameValuePair>
            </NameValueList>
          </Box>
        </Tab>
        <Tab title="Animals">
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
            <Button 
              label="Add Patient" 
              disabled={client.client_inactive ? true : false}
              icon={<FontAwesomeIcon icon={faPlus} size='2x'/>} 
              reverse 
              primary 
              color="status-ok" 
              hoverIndicator 
              size="small"  
              onClick={() => setShowPatientAdd(true)} 
            />
            <DataTable
              columns={[
                {header:<Text color="white" weight="bold">Name</Text>, property: "patient_name", primary: true},
                {header: <Text color="white" weight="bold">Age</Text>, property: "patient_age"},
                {property: "patient_species", header: <Text color="white" weight="bold">Species</Text>},
                {property: "patient_breed", header: <Text color="white" weight="bold">Breed</Text>},
                {property: "patient_reason_inactive", header: <Text color="white" weight="bold">Status</Text>},
              ]}
              background={{"header": {"color":"brand"}}} 
              border="horizontal"
              onClickRow={({ datum }) => {navigate(`/patient/${datum.patient_id}`)}} 
              data={patients} 
              step={10}
              fill="horizontal" 
              pad="small" 
              sortable 
              resizeable 
              paginate 
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
            { // Display reactivate button if user is inactive 
              // Display deactivate button if user is active
              client.client_inactive ? (
                <Button 
                  label="Reactivate Account" 
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
                  icon={<FontAwesomeIcon icon={faUserSlash} />} 
                  hoverIndicator={{"color":"neutral-4","dark":true}}   
                  color="status-critical" 
                  onClick={() => setShowClientDeactivate(true)} 
                  size="medium" 
                  reverse 
                  primary 
                />
                )
            }
            <Button 
              label="Edit Account" 
              icon={<FontAwesomeIcon icon={faPencil} />} 
              size="medium" 
              color="accent-4" 
              onClick={() => setShowClientEdit(true)} 
              disabled={client.client_inactive ? true : false}
              reverse 
              hoverIndicator 
              primary 
            />
          </Box>
        </Tab>
      </Tabs>

      { // Display client edit modal if required
      showClientEdit && (
        <EditClientModal 
          closeForm={closeForms} 
          data={client} 
          client={clientId} 
          updateClient={updateClient}
        />
      )}

      { // Display add patient modal if required
      showPatientAdd && (
        <AddPatientModal 
          closeForm={closeForms} 
          client={clientId} 
          addPatient={updatePatients}
        />
      )}

      { // Display client deactivate modal if required
      showClientDeactivate && (
        <WarningModal 
          closeForm={closeForms} 
          type="client" 
          clientId={clientId} 
          changeActiveState={updateActiveState}
        />
      )}
    </Box>
  )
}

export default Client
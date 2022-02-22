import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Text } from "grommet";
import { 
  AddCircle, 
  Checkmark,
  CircleInformation, 
  Close, 
  Edit } from "grommet-icons";

// Components
import EditClientModal from "../../components/EditClientModal";
import AddPatientModal from "../../components/AddPatientModal";
import WarningModal from "../../components/WarningModal";

const Client = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();

  const [showClientEdit, setShowClientEdit] = useState(false);
  const [showClientDeactivate, setShowClientDeactivate] = useState(false);
  const [showPatientAdd, setShowPatientAdd] = useState(false);
  const [client, setClient] = useState([]);
  const [patients, setPatients] = useState([]);

  const closeForms = () => {
    setShowClientEdit(false);
    setShowPatientAdd(false);
    setShowClientDeactivate(false);
  }

  // Fetch clients data
  useEffect(() => {
    const client_url = `${process.env.REACT_APP_API_END_POINT}/api/clients/${clientId}`;
    const patients_url = `${process.env.REACT_APP_API_END_POINT}/api/patients/client/${clientId}`;

    axios.get(client_url)
      .then(res => {
        const client_data = res.data;
        setClient(client_data[0]);
      });

    axios.get(patients_url)
      .then(res => {
        const patient_data = res.data;
        setPatients(patient_data);
      })
  }, []);

  // Function to handle the reactivation of a client acc
  const onReactivation = async e => {
    const reactivate_client_url = `${process.env.REACT_APP_API_END_POINT}/api/clients/reactivate/${clientId}`;

    // Try to send user data to the server 
    try {
      axios.put(reactivate_client_url)
      .then((response) => {
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
      <Heading level="2" textAlign="center" color={client.client_inactive ? "border" : "black"}>
        {`${client.client_surname}, ${client.client_forename}`}
      </Heading>
      {client.client_inactive && (
        <Heading level="4" textAlign="center" color="red" margin="none" gap="none">
          {`Client is deactivated: ${client.client_reason_inactive}`}
        </Heading>)
      }
      <Tabs justify="start">
        <Tab title="Info" icon={<CircleInformation />} reverse>
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
              icon={<AddCircle />} 
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
                {property: "patient_breed", header: <Text color="white" weight="bold">Breed</Text>}]}
              data={patients} 
              paginate 
              step={10}
              sortable 
              resizeable 
              fill="horizontal" 
              pad="small" 
              background={{"header": {"color":"brand"}}} 
              onClickRow={({ datum }) => {navigate(`/patient/${datum.patient_id}`)}} 
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
            {
              client.client_inactive ? (
                <Button 
                  label="Reactivate Account" 
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
                  onClick={() => setShowClientDeactivate(true)} 
                />
                )
            }
            <Button 
              label="Edit Account" 
              icon={<Edit />} 
              reverse 
              primary 
              size="medium" 
              hoverIndicator 
              color="accent-4" 
              onClick={() => setShowClientEdit(true)} 
            />
          </Box>
        </Tab>
      </Tabs>

      {showClientEdit && (
        <EditClientModal closeForm={closeForms} data={client} client={clientId} />
      )}

      {showPatientAdd && (
        <AddPatientModal closeForm={closeForms} client={clientId} />
      )}

      {showClientDeactivate && (
        <WarningModal closeForm={closeForms} type="client" clientId={clientId}/>
      )}
    </Box>
  )
}

export default Client
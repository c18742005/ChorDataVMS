import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Box, 
  Button, 
  Form, 
  FormField, 
  Heading, 
  Layer, 
  Select, 
  Text } from 'grommet';

const WarningModal = (props) => {
  const defaultValues = {
    reason_inactive: ""
  };

  const [values, setValues] = useState(defaultValues);
  const { reason_inactive } = values;

  // Function to handle the deactivation of a client acc
  const deactivateClient = async e => {
    const deactivate_client_url = `${process.env.REACT_APP_API_END_POINT}/api/clients/deactivate/${props.clientId}`;

    // Try to send user data to the server 
    try {
      axios.put(deactivate_client_url,
        {client_reason_inactive: reason_inactive}
      )
      .then((response) => {
        props.changeActiveState(reason_inactive);
        props.closeForm();
        toast.success(response.data.message);
      }, (error) => {
        toast.error(error.message);
      });   
    } catch (err) {
      console.error(err.message);
    }
  }

  // Function to handle the deactivation of a patient
  const deactivatePatient = async e => {
    const deactivate_patient_url = `${process.env.REACT_APP_API_END_POINT}/api/patients/deactivate/${props.patientId}`;

    // Try to send user data to the server 
    try {
      axios.put(deactivate_patient_url,
        {patient_reason_inactive: reason_inactive}
      )
      .then((response) => {
        props.changeActiveState(reason_inactive);
        props.closeForm()
        toast.success(response.data.message);
      }, (error) => {
        toast.error(error.message);
      });   
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <Layer animate modal responsive onClickOutside={ props.closeForm } >
      <Heading level="3" color="status-critical" margin="small">
        Warning!
      </Heading>
      <Text textAlign="start" color="status-critical" margin="small">
        {props.type === "client" ? "Client" : "Patient"} will be marked as inactive. Please state a reason for deactivating this account
      </Text>
      <Form
        onSubmit={props.type === "client" ? deactivateClient : deactivatePatient}
        onChange={(nextValue) => {
          setValues(nextValue);
        }}
      >
        <FormField name="reason_inactive" required>
          <Select 
            options={props.type === "client" ? (
              ["Client Deceased","Client Relocating","Other"]) : (
                ["Patient Deceased", "Patient Rehomed", "Client Relocating", "Other"])} 
            placeholder="Reason"
            value={reason_inactive} 
            name="reason_inactive" 
            closeOnChange />
        </FormField>
        <Box align="end" justify="end" pad="small" direction="row" gap="small">
          <Button 
            label="Deactivate" 
            color="status-critical" 
            hoverIndicator={{"color":"neutral-4","dark":true}}
            type="submit"
            primary 
          />
          <Button 
            label="Cancel" 
            onClick={ props.closeForm }
            primary 
            hoverIndicator 
          />
        </Box>
      </Form>
    </Layer>
  )
}

export default WarningModal
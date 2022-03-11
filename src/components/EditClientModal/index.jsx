import axios from 'axios';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { 
  Box, 
  Button, 
  Form, 
  FormField, 
  Heading, 
  Layer, 
  Select, 
  TextInput } from "grommet"

// County data needed for form select
import { Counties } from '../AddClientForm/counties';

/*
  props:
    (Object): data: Holds info about the client i.e. name, address, email
    (String): client: ID of the client to edit
    (Fn: Client) updateClient: Function to update a client in the client state
    (Fn: Client) closeForm: Function to close the edit client modal
*/
const EditClientModal = (props) => {
  const defaultValues = {
    client_forename: props.data.client_forename,
    client_surname: props.data.client_surname,
    client_address: props.data.client_address,
    client_city: props.data.client_city,
    client_county: props.data.client_county,
    client_phone: props.data.client_phone,
    client_email: props.data.client_email
  };

  // Set state of form values
  const [values, setValues] = useState(defaultValues);

  // Store client ID
  const client_id = props.client;

  // Destructure values
  const { 
    client_forename,
    client_surname,
    client_address,
    client_city,
    client_county,
    client_phone,
    client_email } = values;

  // Function to handle submission of the edit client form
  const onSubmitForm = async e => {
    e.preventDefault();
    const update_client_url = `${process.env.REACT_APP_API_END_POINT}/api/clients/${client_id}`;

    // Try to send client data to the server 
    try {
      await axios.put(update_client_url, {
        client_forename: client_forename,
        client_surname: client_surname,
        client_address: client_address,
        client_city: client_city,
        client_county: client_county,
        client_phone: client_phone,
        client_email: client_email
      }, {
        headers: {
          'token': localStorage.token
      }})
      .then((response) => {
        // Success: update client state, close form and send success message
        props.updateClient(values);
        props.closeForm();
        toast.success(response.data.message);
      }, (error) => {
        // Error: Check error type
        if(error.response.status === 422) {
          // Display validation errors to user
          const errors = error.response.data.errors

          errors.forEach((err) => {
            toast.error(err.msg);
          })
        } else {
          // Display single error message to user
          toast.error(error.response.data);
        }
      });   
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <Layer animate modal onClickOutside={props.closeForm} position="center">
      <Heading level="2" textAlign="center">Edit Client</Heading>
      <Box align="center" justify="center" direction="column" margin="medium">
        <Form 
          onSubmit={onSubmitForm}
          onChange={(nextValue) => {
            setValues(nextValue);
          }}
        >
          <FormField name="client_forename" required>
            <TextInput 
              placeholder="First Name" 
              size="medium" 
              type="text" 
              value={client_forename} 
              name="client_forename" 
              plain 
            />
          </FormField>
          <FormField name="client_surname" required>
            <TextInput 
              placeholder="Surname" 
              size="medium" 
              type="text" 
              value={client_surname} 
              name="client_surname" 
              plain 
            />
          </FormField>
          <FormField name="client_address" required>
            <TextInput 
              placeholder="Home Address" 
              size="medium" 
              type="text" 
              value={client_address} 
              name="client_address" 
              plain 
            />
          </FormField>
          <FormField name="client_city" required>
            <TextInput 
              placeholder="City" 
              size="medium" 
              type="text" 
              value={client_city} 
              name="client_city" 
              plain 
            />
          </FormField>
          <FormField  name="client_county" required>
            <Select 
              options={Counties} 
              closeOnChange 
              placeholder="County" 
              value={client_county} 
              name="client_county" 
              plain 
            />
          </FormField>
          <FormField name="client_phone" required>
            <TextInput 
              placeholder="Phone Number" 
              size="medium" 
              type="text" 
              value={client_phone} 
              name="client_phone" 
              plain 
            />
          </FormField>
          <FormField name="client_email" required>
            <TextInput 
              placeholder="Email" 
              size="medium" 
              type="text" 
              value={client_email} 
              name="client_email" 
              plain 
            />
          </FormField>
          <Box align="center" justify="center" direction="row" gap="small">
            <Button label="Edit" primary hoverIndicator type="submit"/>
            <Button 
              label="Cancel"
              color="accent-4" 
              onClick={props.closeForm}
              primary 
              hoverIndicator
            />
          </Box>
        </Form>
      </Box>
    </Layer>
  )
}

export default EditClientModal
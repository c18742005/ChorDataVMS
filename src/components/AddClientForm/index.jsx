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
  TextInput } from 'grommet';

// external data needed for dropdown 
import { Counties } from './counties';

/*
  props:
    (String) clinic: ID of the clinic current staff is part of
    (Fn: Clients) addClient: Function to add a client to the Clients state
    (Fn: Clients) closeForm: Function to close the add client modal
*/
const AddClientForm = ({ clinic, addClient, closeForm }) => {
  const defaultValues = {
    client_forename: "",
    client_surname: "",
    client_address: "",
    client_city: "",
    client_county: "",
    client_phone: "",
    client_email: ""
  };
  
  // State to hold form values
  const [values, setValues] = useState(defaultValues);

  // Destructure values state
  const { 
    client_forename,
    client_surname,
    client_address,
    client_city,
    client_county,
    client_phone,
    client_email } = values;

  // Function to handle submission of the add client form
  const onSubmitForm = async e => {
    e.preventDefault();
    const add_client_url = `${process.env.REACT_APP_API_END_POINT}/api/clients`;

    // Try to send client data to the server 
    try {
      await axios.post(add_client_url, {
        client_forename: client_forename,
        client_surname: client_surname,
        client_address: client_address,
        client_city: client_city,
        client_county: client_county,
        client_phone: client_phone,
        client_email: client_email,
        client_clinic_id: clinic
      },
      {
        headers: {
          'token': localStorage.token
      }})
      .then((response) => {
        // Success: Update clients state and close form
        addClient(response.data.body);
        closeForm();
        toast.success(response.data.message);
      }, (error) => {
        // Error: Check error type
        if(error.response.status === 422) {
          // Output validation errors to the user
          const errors = error.response.data.errors

          errors.forEach((err) => {
            toast.error(err.msg);
          })
        } else {
          // Output single error to user
          toast.error(error.response.data);
        }
      });   
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <Layer animate modal onClickOutside={closeForm} position="center">
      <Heading level="2" textAlign="center">Add Client</Heading>
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
              plain 
              value={client_forename} 
              name="client_forename" 
            />
          </FormField>
          <FormField name="client_surname" required>
            <TextInput 
              placeholder="Surname" 
              size="medium" 
              type="text" 
              plain 
              value={client_surname} 
              name="client_surname" 
            />
          </FormField>
          <FormField name="client_address" required>
            <TextInput 
              placeholder="Home Address" 
              size="medium" 
              type="text" 
              plain 
              value={client_address} 
              name="client_address" 
            />
          </FormField>
          <FormField name="client_city" required>
            <TextInput 
              placeholder="City" 
              size="medium" 
              type="text" 
              plain 
              value={client_city} 
              name="client_city" 
            />
          </FormField>
          <FormField  name="client_county" required>
            <Select 
              options={Counties} 
              closeOnChange 
              placeholder="County" 
              plain 
              value={client_county} 
              name="client_county" 
            />
          </FormField>
          <FormField name="client_phone" required>
            <TextInput 
              placeholder="Phone Number" 
              size="medium" 
              type="text" 
              plain 
              value={client_phone} 
              name="client_phone" 
            />
          </FormField>
          <FormField name="client_email" required>
            <TextInput 
              placeholder="Email" 
              size="medium" 
              type="text" 
              plain 
              value={client_email} 
              name="client_email" 
            />
          </FormField>
          <Box align="center" justify="center" direction="row" gap="small">
            <Button label="Add" primary hoverIndicator type="submit"/>
            <Button 
              label="Cancel"
              color="accent-4" 
              onClick={closeForm}
              primary 
              hoverIndicator
            />
          </Box>
        </Form>
      </Box>
    </Layer>
  )
}

export default AddClientForm 
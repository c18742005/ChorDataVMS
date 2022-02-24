import axios from 'axios';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { Counties } from './counties';
import { 
  Box, 
  Button, 
  Form, 
  FormField, 
  Heading, 
  Layer, 
  Select, 
  TextInput } from 'grommet';

const AddClientForm = (props) => {
  const defaultValues = {
    client_forename: "",
    client_surname: "",
    client_address: "",
    client_city: "",
    client_county: "",
    client_phone: "",
    client_email: ""
  };
  
  const [values, setValues] = useState(defaultValues);
  const client_clinic_id = 1;

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

    // Try to send user data to the server 
    try {
      axios.post(add_client_url, {
        client_forename: client_forename,
        client_surname: client_surname,
        client_address: client_address,
        client_city: client_city,
        client_county: client_county,
        client_phone: client_phone,
        client_email: client_email,
        client_clinic_id: client_clinic_id
      })
      .then((response) => {
        props.addClient(response.data.body);
        props.closeForm();
        toast.success(response.data.message);
      }, (error) => {
        if(error.response.status === 422) {
          const errors = error.response.data.errors

          errors.forEach((err) => {
            toast.error(err.msg);
          })
        } else {
          toast.error(error.response.data);
        }
      });   
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <Layer animate modal onClickOutside={props.closeForm} position="center">
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
            <Button label="Cancel" primary hoverIndicator color="accent-4" onClick={props.closeForm}/>
          </Box>
        </Form>
      </Box>
    </Layer>
  )
}

export default AddClientForm
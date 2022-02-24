import axios from 'axios';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { Species } from './species';
import { 
  Box, 
  Button, 
  Form, 
  FormField, 
  Heading, 
  Layer, 
  Select, 
  TextInput } from 'grommet';

const AddPatientModal = (props) => {
  const defaultValues = {
    patient_name: "",
    patient_species: "",
    patient_breed: "",
    patient_age: "",
    patient_sex: "",
    patient_color: "",
    patient_microchip: ""
  };

  const [values, setValues] = useState(defaultValues);
  const client_id = props.client;

  const { 
    patient_name,
    patient_species,
    patient_breed,
    patient_age,
    patient_sex,
    patient_color,
    patient_microchip } = values;

  // Function to handle submission of the add patient form
  const onSubmitForm = async e => {
    e.preventDefault();
    const add_client_url = `${process.env.REACT_APP_API_END_POINT}/api/patients`;

    // Try to send user data to the server 
    try {
      axios.post(add_client_url, {
        patient_name: patient_name,
        patient_species: patient_species,
        patient_breed: patient_breed,
        patient_age: patient_age,
        patient_sex: patient_sex,
        patient_color: patient_color,
        patient_microchip: patient_microchip,
        patient_client_id: client_id
      })
      .then((response) => {
        props.addPatient(response.data.body)
        props.closeForm();
        toast.success(response.data.message);
      }, (error) => {
        toast.error(error.message);
      });   
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <Layer animate modal onClickOutside={props.closeForm} position="center">
      <Heading level="2" textAlign="center">Add Patient</Heading>
      <Box align="center" justify="center" direction="column" margin="medium">
        <Form
          onSubmit={onSubmitForm}
          onChange={(nextValue) => {
            setValues(nextValue);
          }}
        >
          <FormField name="patient_name" required>
            <TextInput 
              placeholder="Name" 
              size="medium" 
              type="text"
              plain 
              name="patient_name" 
              value={patient_name} 
            />
          </FormField>
          <FormField name="patient_species" required>
            <Select 
              options={Species} 
              closeOnChange 
              placeholder="Species" 
              plain
              name="patient_species"
              value={patient_species} 
            />
          </FormField>
          <FormField name="patient_breed" required>
            <TextInput 
              placeholder="Breed" 
              size="medium" 
              type="text"
              plain 
              name="patient_breed" 
              value={patient_breed} 
            />
          </FormField>
          <FormField name="patient_age" required>
            <TextInput 
              placeholder="Age" 
              size="medium" 
              type="text" 
              plain 
              name="patient_age"
              value={patient_age}
            />
          </FormField>
          <FormField name="patient_sex" required>
            <Select 
              options={["MN", "FN", "M", "F"]} 
              closeOnChange 
              placeholder="Sex" 
              plain 
              name="patient_sex"
              value={patient_sex}
            />
          </FormField>
          <FormField name="patient_color" required>
            <TextInput 
              placeholder="Color" 
              size="medium" 
              type="text" 
              plain 
              name="patient_color"
              value={patient_color}
            />
          </FormField>
          <FormField name="patient_microchip" required>
            <TextInput 
              placeholder="Microchip Number" 
              size="medium" 
              type="text" 
              plain 
              name="patient_microchip"
              value={patient_microchip}
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

export default AddPatientModal
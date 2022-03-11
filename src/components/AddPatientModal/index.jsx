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

// Import data needed for species and breeds select
import { dog_breeds } from './dog_breeds';
import { cat_breeds } from './cat_breeds';
import { bird_breeds } from './bird_breeds';
import { reptile_breeds } from './reptile_breeds';
import { rodent_breeds } from './rodent_breeds';
import { Species } from './species';

/*
  props:
    (String) client: ID of the client
    (Fn: Client) addPatient: Function to add patient to the client state
    (Fn: Client) closeForm: Function to close the add patient modal
*/
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

  // Store the values of the form and the breed currently selected in state
  const [values, setValues] = useState(defaultValues);
  const [breed, setBreed] = useState([])

  // Store the client ID
  const client_id = props.client;

  // Destructure the values state
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
    const add_patient_url = `${process.env.REACT_APP_API_END_POINT}/api/patients`;

    // Try to send patient data to the server 
    try {
      await axios.post(add_patient_url, {
        patient_name: patient_name,
        patient_species: patient_species,
        patient_breed: patient_breed,
        patient_age: patient_age,
        patient_sex: patient_sex,
        patient_color: patient_color,
        patient_microchip: patient_microchip,
        patient_client_id: client_id
      }, {
        headers: {
          'token': localStorage.token
      }})
      .then((response) => {
        // Success: Add new patient to the patient state
        // Close form and send a success message
        props.addPatient(response.data.body)
        props.closeForm();
        toast.success(response.data.message);
      }, (error) => {
        // Error: Check error type
        if(error.response.status === 422) {
          // Display validation errors to the user
          const errors = error.response.data.errors

          errors.forEach((err) => {
            toast.error(err.msg);
          })
        } else {
          // Display single error to user
          toast.error(error.response.data);
        }
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
              name="patient_name" 
              value={patient_name} 
              plain 
            />
          </FormField>
          <FormField name="patient_species" required>
            <Select 
              options={Species} 
              closeOnChange 
              placeholder="Species" 
              name="patient_species"
              value={patient_species} 
              plain
              onChange={({ option }) => {
                // Set the breed file depending on the species selected
                switch(option) {
                  case 'Avian':
                    setBreed(bird_breeds);
                    break;
                  case 'Canine':
                    setBreed(dog_breeds);
                    break;
                  case 'Feline':
                    setBreed(cat_breeds);
                    break;
                  case 'Reptile':
                    setBreed(reptile_breeds);
                    break;
                  case 'Rodent':
                    setBreed(rodent_breeds);
                    break;
                  default:
                    setBreed([]);
                }
              }}
            />
          </FormField>
          <FormField name="patient_breed" required>
            <Select
              placeholder="Breed" 
              size="medium" 
              options={breed}
              value={patient_breed}
              name="patient_breed"
              plain
            />
          </FormField>
          <FormField name="patient_age" required>
            <TextInput 
              placeholder="Age" 
              size="medium" 
              type="text" 
              name="patient_age"
              value={patient_age}
              plain 
            />
          </FormField>
          <FormField name="patient_sex" required>
            <Select 
              options={["MN", "FN", "M", "F"]} 
              closeOnChange 
              placeholder="Sex" 
              name="patient_sex"
              value={patient_sex}
              plain 
            />
          </FormField>
          <FormField name="patient_color" required>
            <TextInput 
              placeholder="Color" 
              size="medium" 
              type="text" 
              name="patient_color"
              value={patient_color}
              plain 
            />
          </FormField>
          <FormField name="patient_microchip" required>
            <TextInput 
              placeholder="Microchip Number" 
              size="medium" 
              type="text" 
              name="patient_microchip"
              value={patient_microchip}
              plain 
            />
          </FormField>
          <Box align="center" justify="center" direction="row" gap="small">
            <Button label="Add" primary hoverIndicator type="submit"/>
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

export default AddPatientModal
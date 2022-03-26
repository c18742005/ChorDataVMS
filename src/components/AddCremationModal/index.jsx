import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  DateInput,
  Form, 
  FormField, 
  Heading, 
  Layer, 
  RadioButtonGroup, 
  Select } from 'grommet';

/*
  props:
    (String): clinicId: ID of the clinic staff that is currently logged in 
    (String): staffId: ID of the staff member currently logged in
    (Fn: Cremation) addCremation: Function to add a cremation to the cremation state
    (Fn: Cremation) closeForm: Function to close the add cremation modal
*/
const AddCremationModal = ({ clinicId, addCremation, closeForm }) => {
  const defaultValues = {
    cremation_date_collected: '',
    cremation_date_ashes_returned_practice: '',
    cremation_date_ashes_returned_owner: '',
    cremation_form: 'Scatter Tube',
    cremation_owner_contacted: 'No',
    cremation_patient_id: 0
  };
  
  // Set state for the form values, patients and current selected patient
  const [values, setValues] = useState(defaultValues);
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState(0);

  // Fetch patient data
  useEffect(() => {
    const fetchData = async () => {
      const get_patients_url = `${process.env.REACT_APP_API_END_POINT}/api/patients/clinic/${clinicId}`;

      try {
        await axios.get(
          get_patients_url, {
            headers: {
              'token': localStorage.token
            }
          }
        )
        .then(res => {
          setPatients(res.data);
        })
      } catch(error) {
        console.error(error.message);
      }
    }

    fetchData();
  }, []);

  // Destructure state values
  const { 
    cremation_date_collected,
    cremation_date_ashes_returned_practice,
    cremation_date_ashes_returned_owner,
    cremation_form,
    cremation_owner_contacted,
    cremation_patient_id } = values;

  // Function to handle submission of the add cremation form
  const onSubmitForm = async e => {
    e.preventDefault();
    const add_cremation_url = `${process.env.REACT_APP_API_END_POINT}/api/cremations`;

    // Try to send cremation data to the server 
    try {
      await axios.post(add_cremation_url, {
        cremation_date_collected: cremation_date_collected,
        cremation_date_ashes_returned_practice: cremation_date_ashes_returned_practice,
        cremation_date_ashes_returned_owner: cremation_date_ashes_returned_owner,
        cremation_form: cremation_form,
        cremation_owner_contacted: cremation_owner_contacted,
        cremation_patient_id: patientId,
        cremation_clinic_id: clinicId
      },
      {
        headers: {
          'token': localStorage.token
      }})
      .then((response) => {
        // Success: Add new cremation to state
        // Close form and send success message
        addCremation(response.data.body);
        closeForm();
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
          // Display single error to user
          toast.error(error.response.data);
        }
      });   
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <Layer animate modal onClickOutside={closeForm} position="center">
      <Heading level="2" textAlign="center">Add Cremation</Heading>
      <Box align="center" justify="center" direction="column" margin="medium">
        <Form 
          onSubmit={onSubmitForm}
          onChange={(nextValue) => {
            setValues(nextValue);
          }}
        >
          <FormField name="cremation_date_collected" label="Date Remains Collected">
            <DateInput
              format="yyyy/mm/dd"
              value={cremation_date_collected === '' ? (
                '') : (
                (new Date(values.cremation_date_collected)).toISOString()
              )}
              name="cremation_date_collected"
              placeholder='Date Remains Collected'
            />
          </FormField>
          <FormField name="cremation_date_ashes_returned_practice" label="Date Returned to Practice">
            <DateInput
              format="yyyy/mm/dd"
              value={cremation_date_ashes_returned_practice === '' ? (
                '') : (
                (new Date(values.cremation_date_ashes_returned_practice)).toISOString()
              )}
              name="cremation_date_ashes_returned_practice"
              placeholder='Date Returned to Practice'
            />
          </FormField>
          <FormField name="cremation_date_ashes_returned_owner" label="Date Returned to Owner">
            <DateInput
              format="yyyy/mm/dd"
              value={cremation_date_ashes_returned_owner === '' ? (
                '') : (
                (new Date(values.cremation_date_ashes_returned_owner)).toISOString()
              )}
              name="cremation_date_ashes_returned_owner"
              placeholder='Date Returned to Owner'
            />
          </FormField>
          <FormField  name="cremation_form" label="Form of Cremation" required>
            <RadioButtonGroup
              options={["Scatter Tube", "Tribute Box", "Urn"]} 
              value={cremation_form} 
              name="cremation_form" 
              plain 
            />
          </FormField>
          <FormField  name="cremation_owner_contacted" label="Owner Contacted?" required>
            <RadioButtonGroup
              options={["Yes", "No"]} 
              value={cremation_owner_contacted} 
              name="cremation_owner_contacted" 
              plain 
            />
          </FormField>
          <FormField  name="cremation_patient_id" required>
            <Select 
              options={patients.map((option) => (`${option.patient_name} - ${option.patient_microchip}`))} 
              closeOnChange 
              placeholder="Patient" 
              value={cremation_patient_id} 
              name="cremation_patient_id" 
              plain 
              onChange={({ option }) => {
                let sep = " - "
                let name = option.substring(0, option.indexOf(sep));
                let microchip = option.substring(option.indexOf(sep) + sep.length, option.length)
                // Loop through patients state to find selected drug
                for(let item in patients) {
                  if(patients[item].patient_name === name 
                    && patients[item].patient_microchip === microchip){
                    setPatientId(patients[item].patient_id)
                  }
                }
              }}
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

export default AddCremationModal 
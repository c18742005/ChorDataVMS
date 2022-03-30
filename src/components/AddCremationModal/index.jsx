import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import DatePicker from "react-widgets/DatePicker";
import "react-widgets/styles.css";
import { 
  Box, 
  Button,
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
    cremation_date_collected: null,
    cremation_date_ashes_returned_practice: null,
    cremation_date_ashes_returned_owner: null,
    cremation_form: 'Scatter Tube',
    cremation_owner_contacted: 'No',
    cremation_patient_id: null
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
      }, {
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
        <Form onSubmit={onSubmitForm}>
          <FormField 
            name="cremation_date_collected" 
            label="Date Remains Collected"
          >
            <DatePicker 
              name='cremation_date_collected'
              value={cremation_date_collected === null ? null : new Date(cremation_date_collected)}
              placeholder="DD/MM/YYYY" 
              onChange={value => setValues({...values, cremation_date_collected: value.toISOString()})}
            />
          </FormField>
          <FormField 
            name="cremation_date_ashes_returned_practice" 
            label="Date Returned to Practice"
          >
            <DatePicker 
              name='cremation_date_ashes_returned_practice'
              value={cremation_date_ashes_returned_practice === null ? null : new Date(cremation_date_ashes_returned_practice)}
              placeholder="DD/MM/YYYY" 
              onChange={value => setValues({...values, cremation_date_ashes_returned_practice: value.toISOString()})}
            />
          </FormField>
          <FormField 
            name="cremation_date_ashes_returned_owner" 
            label="Date Returned to Owner"
          >
            <DatePicker 
              name='cremation_date_ashes_returned_owner'
              value={cremation_date_ashes_returned_owner === null ? null : new Date(cremation_date_ashes_returned_owner)}
              placeholder="DD/MM/YYYY" 
              onChange={value => setValues({...values, cremation_date_ashes_returned_owner: value.toISOString()})}
            />
          </FormField>
          <FormField  name="cremation_form" label="Form of Cremation" required>
            <RadioButtonGroup
              options={["Scatter Tube", "Tribute Box", "Urn"]} 
              value={cremation_form} 
              name="cremation_form" 
              onChange={evt => setValues({...values, cremation_form: evt.target.value})}
              plain 
            />
          </FormField>
          <FormField  name="cremation_owner_contacted" label="Owner Contacted?" required>
            <RadioButtonGroup
              options={["Yes", "No"]} 
              value={cremation_owner_contacted} 
              name="cremation_owner_contacted" 
              onChange={evt => setValues({...values, cremation_owner_contacted: evt.target.value})}
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
                // Loop through patients state to find selected patient
                for(let item in patients) {
                  if(patients[item].patient_name === name 
                    && patients[item].patient_microchip === microchip){
                      setValues({...values, cremation_patient_id: option})
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
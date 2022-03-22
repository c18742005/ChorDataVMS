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
    (Object) data: Holds info about the cremation i.e. date collected, date returned, patient, etc.
    (String) clinicId: ID of the clinic the cremation belongs to
    (Fn: CremationTable) updateCremation: Function to update a cremation info in the cremation state
    (Fn: CremationTable) deleteCremation: Function to delete a cremation from the cremation state
    (Fn: CremationTable) closeForm: Function to close the edit cremation modal
*/
const EditCremationModal = ({ clinicId, closeForm, data, updateCremation, deleteCremation }) => {
  // Set the default values for the state
  const defaultValues = {
    cremation_date_collected: data.cremation_date_collected,
    cremation_date_ashes_returned_practice: data.cremation_date_ashes_returned_practice,
    cremation_date_ashes_returned_owner: data.cremation_date_ashes_returned_owner,
    cremation_form: data.cremation_form,
    cremation_owner_contacted: data.cremation_owner_contacted,
    cremation_patient_name: data.patient_name + ' - ' + data.patient_microchip
  };
  
  // Set the state of the edit cremation form values and patients
  const [values, setValues] = useState(defaultValues);
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState(data.cremation_patient_id);

  // Fetch clients data from the server
  useEffect(() => {
    const fetchData = async () => {
      const get_patients_url = `${process.env.REACT_APP_API_END_POINT}/api/patients/clinic/${clinicId}`;

      try {
        await axios.get(get_patients_url, {
            headers: {
              'token': localStorage.token
            }
          }
        )
        .then(res => {
          // Success: set patients state
          setPatients(res.data);
        })
      } catch (error) {
        console.error(error.message);
      }
    }

    fetchData();
  }, []);

  // Destructure form values state
  const { 
    cremation_date_collected,
    cremation_date_ashes_returned_practice,
    cremation_date_ashes_returned_owner,
    cremation_form,
    cremation_owner_contacted,
    cremation_patient_name } = values;

  // Function to handle submission of the edit cremation form
  const onSubmitForm = async e => {
    e.preventDefault();

    const update_cremation_url = `${process.env.REACT_APP_API_END_POINT}/api/cremations/${data.cremation_id}`;

    // Try to send cremation data to the server 
    try {
      await axios.put(update_cremation_url, {
        cremation_date_collected: cremation_date_collected === '' ? null : cremation_date_collected,
        cremation_date_ashes_returned_practice: cremation_date_ashes_returned_practice  === '' ? null : cremation_date_ashes_returned_practice,
        cremation_date_ashes_returned_owner: cremation_date_ashes_returned_owner  === '' ? null : cremation_date_ashes_returned_owner,
        cremation_form: cremation_form,
        cremation_owner_contacted: cremation_owner_contacted,
        cremation_patient_id: patientId
      }, {
        headers: {
          'token': localStorage.token
      }})
      .then((response) => {
        // Success: update the cremation state, close the form and display success message
        updateCremation(response.data.body);
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
          // Display single error message to user
          toast.error(error.response.data);
        }
      });   
    } catch (err) {
      console.error(err.message);
    }
  }

    // Function to handle the removal of a cremation
    const removeCremation = async e => {
      const remove_cremation_url = `${process.env.REACT_APP_API_END_POINT}/api/cremations/${data.cremation_id}`;
  
      // Try to send cremation data to the server 
      try {
        await axios.delete(remove_cremation_url, {
          headers: {
            'token': localStorage.token
        }})
        .then((response) => {
          // Success: update the cremation state, close the form and display success message
          deleteCremation(response.data.cremationId);
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
            // Display single error message to user
            toast.error(error.response.data);
          }
        });   
      } catch (err) {
        console.error(err.message);
      }
    }

  return (
    <Layer animate modal onClickOutside={closeForm} position="center">
      <Heading level="2" textAlign="center">Edit Cremation</Heading>
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
              value={cremation_date_collected}
              name="cremation_date_collected"
              placeholder='Date Remains Collected'
            />
          </FormField>
          <FormField name="cremation_date_ashes_returned_practice" label="Date Returned to Practice">
            <DateInput
              format="yyyy/mm/dd"
              value={cremation_date_ashes_returned_practice}
              name="cremation_date_ashes_returned_practice"
              placeholder='Date Returned to Practice'
            />
          </FormField>
          <FormField name="cremation_date_ashes_returned_owner" label="Date Returned to Owner">
            <DateInput
              format="yyyy/mm/dd"
              value={cremation_date_ashes_returned_owner}
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
              value={cremation_patient_name} 
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
            <Button label="Edit Cremation" primary hoverIndicator type="submit"/>
            <Button 
              label="Remove Cremation" 
              color="status-critical" 
              onClick={removeCremation}
              primary 
              hoverIndicator 
            />
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

export default EditCremationModal
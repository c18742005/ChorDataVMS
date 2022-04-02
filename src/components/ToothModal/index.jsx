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
  TextArea } from 'grommet';

/*
  props:
    (Object) tooth: Object that holds tooth data i.e. ID, problem, notes
    (Fn: CanineDental/FelineDental) updateTooth: Function to update a tooth
    (Fn: CanineDental/FelineDental) closeForm: Function to close the tooth modal
*/
const ToothModal = ({ tooth, updateTooth, closeForm }) => {
  const defaultValues = {
    tooth_id: tooth.tooth_id,
    tooth_problem: tooth.tooth_problem === null ? "Healthy" : tooth.tooth_problem,
    tooth_note: tooth.tooth_note === null ? "" : tooth.tooth_note,
    tooth_patient_id: tooth.tooth_patient_id
  };
  
  // Set state for the tooth values
  const [values, setValues] = useState(defaultValues);

  // Destructure state values
  const { 
    tooth_id,
    tooth_problem,
    tooth_note,
    tooth_patient_id } = values;

  // Function to handle submission of the update tooth form
  const onSubmitForm = async e => {
    e.preventDefault();
    const update_tooth_url = `${process.env.REACT_APP_API_END_POINT}/api/dentals/tooth/${tooth_id}/patient/${tooth_patient_id}`;

    // Try to update tooth data on the DB
    try {
      await axios.put(update_tooth_url, {
        tooth_note: tooth_note,
        tooth_problem: tooth_problem
      }, {
        headers: {
          'token': localStorage.token
      }})
      .then((response) => {
        // Success: Update tooth state
        // Close form and send success message
        updateTooth(response.data.body);
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
    <Layer 
      animate 
      modal 
      onClickOutside={() => {
        setValues({})
        closeForm()
      }} 
      position="center"
    >
      <Heading level="2" textAlign="center">Tooth {tooth_id}</Heading>
      <Box align="center" justify="center" direction="column" margin="medium">
        <Form 
          onSubmit={onSubmitForm}
          onChange={(value) => {
            setValues({...values, ...value})
          }}
        >
          <FormField  name="tooth_problem" required>
            <Select 
              value={tooth_problem} 
              name="tooth_problem" 
              options={[
                "Gingivitis", 
                "Wear", 
                "Recession", 
                "FORL", 
                "Furcation", 
                "Missing", 
                "Extracted", 
                "Fracture",
                "Healthy"
              ].sort()} 
              closeOnChange 
              placeholder="Tooth Problem" 
              plain 
            />
          </FormField>
          <FormField name="tooth_note">
            <TextArea 
              placeholder="Notes" 
              size="medium" 
              type="text" 
              value={tooth_note} 
              name="tooth_note"
              plain 
            />
          </FormField>
          <Box align="center" justify="center" direction="row" gap="small">
            <Button label="Update" primary hoverIndicator type="submit"/>
            <Button 
              label="Cancel" 
              color="accent-4" 
              onClick={() => {
                setValues({})
                closeForm()
              }}
              primary 
              hoverIndicator 
            />
          </Box>
        </Form>
      </Box>
    </Layer>
  )
}

export default ToothModal
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
  Select, 
  TextInput } from 'grommet';

/*
  props:
    (String): clinicId: ID of the clinic staff that is currently logged in 
    (String): staffId: ID of the staff member currently logged in
    (Fn: Xrays) addXray: Function to add an xray to the Xray state
    (Fn: Xrays) closeForm: Function to close the add xray modal
*/
const AddXrayModal = ({ clinicId, staffId, addXray, closeForm }) => {
  const defaultValues = {
    xray_date: new Date().toISOString(),
    xray_image_quality: "",
    xray_kV: "",
    xray_mAs: "",
    xray_position: "",
    xray_patient_id: 0,
    xray_staff_id: 0,
    xray_clinic_id: 0
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
          get_patients_url,
          {
            headers: {
              'token': localStorage.token
            }
          }
        )
        .then(res => {
          setPatients(res.data);
        })
      } catch (error) {
        console.error(error.message);
      }
    }

    fetchData();
  }, []);

  // Destructure state values
  const { 
    xray_date,
    xray_image_quality,
    xray_kV,
    xray_mAs,
    xray_position,
    xray_patient_id } = values;

  // Function to handle submission of the add xray form
  const onSubmitForm = async e => {
    e.preventDefault();
    const add_xray_url = `${process.env.REACT_APP_API_END_POINT}/api/xrays`;

    // Try to send xray data to the server 
    try {
      await axios.post(add_xray_url, {
        xray_date: xray_date,
        xray_image_quality: xray_image_quality,
        xray_kV: xray_kV,
        xray_mAs: xray_mAs,
        xray_position: xray_position,
        xray_patient_id: patientId,
        xray_staff_id: staffId,
        xray_clinic_id: clinicId
      },
      {
        headers: {
          'token': localStorage.token
      }})
      .then((response) => {
        // Success: Add new xray to state
        // Close form and send success message
        addXray(response.data.body);
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
      <Heading level="2" textAlign="center">Add Xray</Heading>
      <Box align="center" justify="center" direction="column" margin="medium">
        <Form 
          onSubmit={onSubmitForm}
          onChange={(nextValue) => {
            setValues(nextValue);
          }}
        >
          <FormField name="xray_date" label="X-ray Date Taken" required>
            <DateInput
              format="yyyy/mm/dd"
              value={(new Date(values.xray_date)).toISOString()}
              name="xray_date"
              placeholder='X-ray Date'
            />
          </FormField>
          <FormField  name="xray_image_quality" required>
            <Select 
              options={["Overexposed", "Underexposed", "Good", "Excellent"]} 
              closeOnChange 
              placeholder="Image Quality" 
              value={xray_image_quality} 
              name="xray_image_quality" 
              plain 
            />
          </FormField>
          <FormField name="xray_kV" required>
            <TextInput 
              placeholder="kV" 
              size="medium" 
              type="text" 
              value={xray_kV} 
              name="xray_kV" 
              plain 
            />
          </FormField>
          <FormField name="xray_mAs" required>
            <TextInput 
              placeholder="mAs" 
              size="medium" 
              type="text" 
              value={xray_mAs} 
              name="xray_mAs" 
              plain 
            />
          </FormField>
          <FormField name="xray_position" required>
            <TextInput 
              placeholder="Position" 
              size="medium" 
              type="text" 
              value={xray_position} 
              name="xray_position" 
              plain 
            />
          </FormField>
          <FormField  name="xray_patient_id" required>
            <Select 
              options={patients.map((patient) => patient.patient_name)} 
              closeOnChange 
              placeholder="Patient" 
              value={xray_patient_id} 
              name="xray_patient_id" 
              plain 
              onChange={({ option }) => {
                for(let item in patients) {
                  if(patients[item].patient_name === option){
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

export default AddXrayModal
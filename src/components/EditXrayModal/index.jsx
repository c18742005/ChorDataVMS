import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import DatePicker from "react-widgets/DatePicker";
import "react-widgets/scss/styles.scss";
import { 
  Box, 
  Button,
  Form, 
  FormField, 
  Heading, 
  Layer, 
  Select, 
  TextInput } from 'grommet';

/*
  props:
    (Object) data: Holds info about the xray i.e. date, quality, kV, mAs
    (String) clinicId: ID of the clinic the Xray belongs to
    (String) staffId: ID of the staff editing the xray
    (Fn: XrayTable) updateXray: Function to update an Xray info in the xray state
    (Fn: XrayTable) closeForm: Function to close the edit xray modal
*/
const EditXrayModal = ({ clinicId, staffId, closeForm, data, updateXray }) => {
  // Set the default values for the state
  const defaultValues = {
    xray_date: data.xray_date,
    xray_image_quality: data.xray_image_quality,
    xray_kV: data.xray_kv,
    xray_mAs: data.xray_mas,
    xray_position: data.xray_position,
    xray_patient_name: data.patient_name + ' - ' + data.patient_microchip,
    xray_patient_microchip: data.patient_microchip
  };
  
  // Set the state of the edit xray form values and patients
  const [values, setValues] = useState(defaultValues);
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState(data.xray_patient_id);

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
  }, [clinicId]);

  // Destructure form values state
  const { 
    xray_date,
    xray_image_quality,
    xray_kV,
    xray_mAs,
    xray_position,
    xray_patient_name } = values;

  // Function to handle submission of the edit xray form
  const onSubmitForm = async e => {
    e.preventDefault();

    const update_xray_url = `${process.env.REACT_APP_API_END_POINT}/api/xrays/${data.xray_id}`;

    // Try to send xray data to the server 
    try {
      await axios.put(update_xray_url, {
        xray_date: xray_date,
        xray_image_quality: xray_image_quality,
        xray_kV: xray_kV,
        xray_mAs: xray_mAs,
        xray_position: xray_position,
        xray_patient_id: patientId,
        xray_staff_id: staffId
      }, {
        headers: {
          'token': localStorage.token
      }})
      .then((response) => {
        // Success: update the xray state, close the form and display success message
        updateXray(response.data.body);
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
      <Heading level="2" textAlign="center">Edit Xray</Heading>
      <Box align="center" justify="center" direction="column" margin="medium">
        <Form 
          onSubmit={onSubmitForm}
        >
          <FormField  name="xray_patient_name" required>
            <Select 
              options={patients.map((option) => (`${option.patient_name} - ${option.patient_microchip}`))} 
              closeOnChange 
              placeholder="Patient" 
              value={xray_patient_name} 
              name="xray_patient_name" 
              plain 
              onChange={({ option }) => {
                let sep = " - "
                let name = option.substring(0, option.indexOf(sep));
                let microchip = option.substring(option.indexOf(sep) + sep.length, option.length)
                // Loop through patients state to find selected drug
                for(let item in patients) {
                  if(patients[item].patient_name === name 
                    && patients[item].patient_microchip === microchip){
                      setValues({...values, xray_patient_name: option})
                      setPatientId(patients[item].patient_id)
                  }
                }
              }}
            />
          </FormField>
          <FormField name="xray_date" label="X-ray Date Taken">
            <DatePicker 
              name='xray_date'
              max={new Date()}
              value={xray_date === null ? null : new Date(xray_date)}
              placeholder="DD/MM/YYYY" 
              onChange={value => setValues({...values, xray_date: value.toISOString()})}
            />
          </FormField>
          <FormField name="xray_kV" required>
            <TextInput 
              placeholder="kV" 
              size="medium" 
              type="text" 
              value={xray_kV} 
              name="xray_kV" 
              onChange={evt => setValues({...values, xray_kV: evt.target.value})}
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
              onChange={evt => setValues({...values, xray_mAs: evt.target.value})}
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
              onChange={evt => setValues({...values, xray_position: evt.target.value})}
              plain 
            />
          </FormField>
          <FormField  name="xray_image_quality" required>
            <Select 
              options={["Overexposed", "Underexposed", "Good", "Excellent"]} 
              closeOnChange 
              placeholder="Image Quality" 
              value={xray_image_quality} 
              name="xray_image_quality" 
              onChange={evt => setValues({...values, xray_image_quality: evt.target.value})}
              plain 
            />
          </FormField>
          <Box align="center" justify="center" direction="row" gap="small">
            <Button type="submit" label="Edit" primary hoverIndicator />
            <Button 
              label="Close" 
              hoverIndicator={{"color":"neutral-4","dark":true}} 
              color="status-critical" 
              onClick={closeForm} 
              primary
            />
          </Box>
        </Form>
      </Box>
    </Layer>
  )
}

export default EditXrayModal
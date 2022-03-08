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

const EditXrayModal = ({ clinicId, staffId, closeForm, data, updateXray }) => {
  const defaultValues = {
    xray_date: data.xray_date,
    xray_image_quality: data.xray_image_quality,
    xray_kV: data.xray_kv,
    xray_mAs: data.xray_mas,
    xray_position: data.xray_position,
    xray_patient_name: data.patient_name
  };
  
  const [values, setValues] = useState(defaultValues);
  const [patients, setPatients] = useState([]);

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

  const { 
    xray_date,
    xray_image_quality,
    xray_kV,
    xray_mAs,
    xray_position,
    xray_patient_name } = values;

  // Function to handle submission of the add xray form
  const onSubmitForm = async e => {
    e.preventDefault();
    let patient_id = 0;

    // Set the patient ID
    for(let item in patients) {
      if(patients[item].patient_name === xray_patient_name) {
        patient_id = patients[item].patient_id;
      }
    }

    const update_xray_url = `${process.env.REACT_APP_API_END_POINT}/api/xrays/${data.xray_id}`;

    // Try to send xray data to the server 
    try {
      await axios.put(update_xray_url, {
        xray_date: xray_date,
        xray_image_quality: xray_image_quality,
        xray_kV: xray_kV,
        xray_mAs: xray_mAs,
        xray_position: xray_position,
        xray_patient_id: patient_id,
        xray_staff_id: staffId
      },
      {
        headers: {
          'token': localStorage.token
      }})
      .then((response) => {
        updateXray(response.data.body);
        closeForm();
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
    <Layer animate modal onClickOutside={closeForm} position="center">
      <Heading level="2" textAlign="center">Edit Xray</Heading>
      <Box align="center" justify="center" direction="column" margin="medium">
        <Form 
          onSubmit={onSubmitForm}
          onChange={(nextValue) => {
            setValues(nextValue);
          }}
        >
          <FormField name="xray_date" label="X-ray Date Taken" required>
            <DateInput
              name="xray_date"
              value={(new Date(values.xray_date)).toISOString()}
              format="yyyy/mm/dd"
              placeholder='X-ray Date'
            />
          </FormField>
          <FormField  name="xray_image_quality" required>
            <Select 
              name="xray_image_quality" 
              value={xray_image_quality} 
              options={["Over exposed", "Under exposed"]} 
              closeOnChange 
              placeholder="Image Quality" 
              plain 
            />
          </FormField>
          <FormField name="xray_kV" required>
            <TextInput 
              name="xray_kV" 
              value={xray_kV} 
              placeholder="kV" 
              size="medium" 
              type="text" 
              plain 
            />
          </FormField>
          <FormField name="xray_mAs" required>
            <TextInput 
              name="xray_mAs" 
              value={xray_mAs} 
              placeholder="mAs" 
              size="medium" 
              type="text" 
              plain 
            />
          </FormField>
          <FormField name="xray_position" required>
            <TextInput 
              name="xray_position" 
              value={xray_position} 
              placeholder="Position" 
              size="medium" 
              type="text" 
              plain 
            />
          </FormField>
          <FormField  name="xray_patient_name" required>
            <Select 
              name="xray_patient_name" 
              options={patients.map((patient) => patient.patient_name)} 
              placeholder="Patient" 
              value={xray_patient_name} 
              plain
              closeOnChange 
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
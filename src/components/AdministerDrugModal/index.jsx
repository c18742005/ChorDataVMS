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
    (String): clinic_id: ID of the clinic staff that is currently logged in 
    (String): staff_id: ID of the staff member currently logged in
    (Fn: Drugs) addLog: Function to add a log to the Drugs log state
    (Fn: Drugs) closeForm: Function to close the add xray modal
*/
const AdministerDrugModal = (props) => {
  const defaultValues = {
    drug_date_given: new Date().toISOString(),
    drug_batch_number: "",
    drug_quantity: "",
    drug_quantity_measure: "",
    patient_administered: 0
  };

  // Set state of form values patients, and currently selected patient
  const [values, setValues] = useState(defaultValues);
  const [patients, setPatients] = useState({});
  const [patientNames, setPatientNames] = useState([]);
  const [patient, setPatient] = useState(0);

  // Store clinic and staff IDs
  const clinic_id = props.clinic_id;
  const staff_id = props.staff_id;

  // Fetch patients data 
  useEffect(() => {
    const fetchData = async () => {
      const get_patients_url = `${process.env.REACT_APP_API_END_POINT}/api/patients/clinic/${clinic_id}`;

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
          setPatientNames(res.data.map(patient => patient.patient_name));
        })
      } catch (error) {
        console.error(error.message);
      }
    }

    fetchData();
  }, []);

  // Destructure values state
  const { 
    drug_date_given,
    drug_batch_number,
    drug_quantity,
    drug_quantity_measure,
    patient_administered
  } = values;

  // Function to handle submission of the administer drug form
  const onSubmitForm = async e => {
    e.preventDefault();
    const patient_drug_url = `${process.env.REACT_APP_API_END_POINT}/api/drugs/log`;

    // Try to send drug data to the server 
    try {
      axios.post(patient_drug_url, {
        drug_date_given: drug_date_given,
        drug_log_drug_stock_id: drug_batch_number,
        drug_quantity_given: drug_quantity,
        drug_quantity_measure: drug_quantity_measure,
        drug_patient_id: patient,
        drug_staff_id: staff_id,
      },
      {
        headers: {
          'token': localStorage.token
        }
      })
      .then((response) => {
        // Success: close form and display success message
        props.addLog(response.data.body)
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
      <Heading level="2" textAlign="center">Administer {props.drug.drug_name}</Heading>
      <Box align="center" justify="center" direction="column" margin="medium">
        <Form
          onSubmit={onSubmitForm}
          onChange={(nextValue) => {
            setValues(nextValue);
          }}
        >
           <FormField name="drug_date_given" label="Date Administered" required>
            <DateInput
              format="yyyy/mm/dd"
              value={(new Date(values.drug_date_given)).toISOString()}
              name="drug_date_given"
            />
          </FormField>
          <FormField name="drug_batch_number" required>
            <TextInput 
              placeholder="Batch Number" 
              size="medium" 
              type="text"
              plain 
              name="drug_batch_number" 
              value={drug_batch_number} 
            />
          </FormField>
          <Box align="center" justify="center" direction="row" gap='medium'>
            <FormField name="drug_quantity" required>
              <TextInput 
                placeholder="Drug Quantity" 
                size="medium" 
                type="text"
                plain 
                name="drug_quantity" 
                value={drug_quantity} 
              />
            </FormField>
            <FormField name="drug_quantity_measure" required>
              <Select
                options={['ml', 'ug', 'mg', 'tablet']}
                name="drug_quantity_measure" 
                value={drug_quantity_measure} 
                placeholder="Measure" 
                plain
                size="medium" 
              />
            </FormField>
          </Box>
          <FormField name="patient_administered" required>
            <Select
              options={patientNames}
              placeholder="Patient Receiving" 
              size="medium" 
              plain 
              name="patient_administered" 
              value={patient_administered}
              onChange={({ option }) => {
                for(let item in patients) {
                  if(patients[item].patient_name === option){
                    setPatient(patients[item].patient_id)
                  }
                }
              }}
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

export default AdministerDrugModal
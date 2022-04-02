import axios from 'axios';
import { toast } from 'react-toastify';
import { useState } from 'react';
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
    (Obj) drug: Object that holds info about the drug to add stock to
    (String): clinic_id: ID of the clinic the current staff belongs to
    (Fn: Drugs) addStock: Function to add drug stock to the drugs state
    (Fn: Drugs) closeForm: Function to close the drug stock modal
*/
const AddDrugStock = (props) => {
  const defaultValues = {
    drug_expiry_date: new Date().toISOString(),
    drug_batch_number: "",
    drug_quantity: "",
    drug_quantity_measure: "",
    drug_concentration_1: "",
    drug_concentration_2: ""
  };

  // State to hold drug values
  const [values, setValues] = useState(defaultValues);

  // Store drug and clinic IDs
  const drug_id = props.drug.drug_id
  const clinic_id = props.clinic_id;

  // Destructure state values
  const { 
    drug_expiry_date,
    drug_batch_number,
    drug_quantity,
    drug_quantity_measure,
    drug_concentration_1,
    drug_concentration_2
  } = values;

  // Function to handle submission of the add drug form
  const onSubmitForm = async e => {
    e.preventDefault();
    const add_drug_url = `${process.env.REACT_APP_API_END_POINT}/api/drugs`;

    // Try to send drug data to the server 
    try {
      await axios.post(add_drug_url, {
        drug_expiry_date: drug_expiry_date,
        drug_batch_id: drug_batch_number,
        drug_quantity: drug_quantity,
        drug_quantity_measure: drug_quantity_measure,
        drug_concentration: `${drug_concentration_1} ${drug_concentration_2}`,
        drug_stock_drug_id: drug_id,
        drug_stock_clinic_id: clinic_id
      },
      {
        headers: {
          'token': localStorage.token
        }
      })
      .then((response) => {
        // Success: Close form and send success message
        props.addStock(response.data.body);
        props.closeForm();
        toast.success(response.data.message);
      }, (error) => {
        // Error: Check type of error
        if(error.response.status === 422) {
          // Send validation error to user
          const errors = error.response.data.errors

          errors.forEach((err) => {
            toast.error(err.msg);
          })
        } else {
          // Send single error message to user
          toast.error(error.response.data);
        }
      });   
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <Layer animate modal onClickOutside={props.closeForm} position="center">
      <Heading level="2" textAlign="center">Add {props.drug.drug_name}</Heading>
      <Box align="center" justify="center" direction="column" margin="medium">
        <Form onSubmit={onSubmitForm}>
          <FormField name="drug_expiry_date" label="Expiry Date">
            <DatePicker 
              name='drug_expiry_date'
              value={drug_expiry_date === null ? null : new Date(drug_expiry_date)}
              min={new Date()}
              placeholder="DD/MM/YYYY" 
              onChange={value => setValues({...values, drug_expiry_date: value.toISOString()})}
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
              onChange={evt => setValues({...values, drug_batch_number: evt.target.value})}
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
                onChange={evt => setValues({...values, drug_quantity: evt.target.value})}
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
                onChange={evt => setValues({...values, drug_quantity_measure: evt.target.value})}
              />
            </FormField>
          </Box>
          <Box align="center" justify="center" direction="row" gap='medium'>
            <FormField name="drug_concentration_1" required>
              <TextInput 
                placeholder="Drug Concentration" 
                size="medium" 
                type="text"
                plain 
                name="drug_concentration_1" 
                value={drug_concentration_1} 
                onChange={evt => setValues({...values, drug_concentration_1: evt.target.value})}
              />
            </FormField>
            <FormField name="drug_concentration_2" required>
              <Select
                options={['mg/ml', 'ug/ml', 'mg/tablet', 'mg/mg']}
                name="drug_concentration_2" 
                value={drug_concentration_2} 
                placeholder="xx per xx" 
                plain
                size="medium" 
                onChange={evt => setValues({...values, drug_concentration_2: evt.target.value})}
              />
            </FormField>
          </Box>
          
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

export default AddDrugStock
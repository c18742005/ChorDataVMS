import axios from 'axios';
import { toast } from 'react-toastify';
import { useState } from 'react';
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

const AddDrugStock = (props) => {
  const defaultValues = {
    drug_expiry_date: new Date(),
    drug_batch_number: "",
    drug_quantity: "",
    drug_quantity_measure: "",
    drug_concentration_1: "",
    drug_concentration_2: ""
  };

  const [values, setValues] = useState(defaultValues);
  const drug_id = props.drug.drug_id
  const clinic_id = props.clinic_id;

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

    // Try to send user data to the server 
    try {
      await axios.post(add_drug_url, {
        drug_expiry_date: drug_expiry_date,
        drug_batch_id: drug_batch_number,
        drug_quantity: drug_quantity,
        drug_quantity_measure: drug_quantity_measure,
        drug_concentration: drug_concentration_1 + drug_concentration_2,
        drug_stock_drug_id: drug_id,
        drug_stock_clinic_id: clinic_id
      },
      {
        headers: {
          'token': localStorage.token
        }
      })
      .then((response) => {
        props.closeForm();
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
    <Layer animate modal onClickOutside={props.closeForm} position="center">
      <Heading level="2" textAlign="center">Add {props.drug.drug_name}</Heading>
      <Box align="center" justify="center" direction="column" margin="medium">
        <Form
          onSubmit={onSubmitForm}
          onChange={(nextValue) => {
            setValues(nextValue);
          }}
        >
          <FormField name="drug_expiry_date" label="Expiry Date" required>
            <DateInput
              format="yyyy/mm/dd"
              value={(new Date(values.drug_expiry_date)).toISOString()}
              name="drug_expiry_date"
              placeholder='Drug Expiry Date'
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
          <Box align="center" justify="center" direction="row" gap='medium'>
            <FormField name="drug_concentration_1" required>
              <TextInput 
                placeholder="Drug Concentration" 
                size="medium" 
                type="text"
                plain 
                name="drug_concentration_1" 
                value={drug_concentration_1} 
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
              />
            </FormField>
          </Box>
          
          <Box align="center" justify="center" direction="row" gap="small">
            <Button label="Add" primary hoverIndicator type="submit"/>
            <Button label="Cancel" primary hoverIndicator color="accent-4" onClick={props.closeForm}/>
          </Box>
        </Form>
      </Box>
    </Layer>
  )
}

export default AddDrugStock
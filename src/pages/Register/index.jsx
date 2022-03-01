import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Anchor, 
  Box, 
  Button, 
  Card, CardBody, CardHeader, CardFooter, 
  Form, FormField, 
  Heading,
  Select,
  TextInput } from 'grommet';
import { AddCircle } from 'grommet-icons';

const Register = ({ setAuth }) => {
  const defaultValues = {
    staff_username: "",
    staff_password: "",
    staff_role: "",
    staff_clinic_id: ""
  };

  const [values, setValues] = useState(defaultValues);

  const { 
    staff_username,
    staff_password,
    staff_role,
    staff_clinic_id } = values;

  // Function to handle submission of the add staff form
  const onSubmitForm = async e => {
    e.preventDefault();
    const register_staff_url = `${process.env.REACT_APP_API_END_POINT}/api/register`;

    // Try to send user data to the server 
    try {
      await axios.post(register_staff_url, {
        username: staff_username,
        password: staff_password,
        role: staff_role,
        clinic_id: staff_clinic_id
      })
      .then((response) => {
        toast.success(response.data.message);

        const parseRes = response.data

        if (parseRes.token) {
          localStorage.setItem("token", parseRes.token);
          setAuth(true);
          toast.success("Registered Successfully");
        } else {
          setAuth(false);
          toast.error(parseRes);
        }
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

  const navigate = useNavigate();
  const loginLink = () => {
    navigate("/login");
  }

  return (
    <Box 
      fill={true}
      overflow="auto" 
      align="center" 
      flex="grow"
    >
      <Card 
        direction="column" 
        align="center" 
        justify="center" 
        pad="small" 
        gap="none" 
        border={{"size":"small"}}
        margin={{"top":"medium"}}
      >
        <CardHeader 
          align="center" 
          direction="column" 
          flex={false} 
          justify="center" 
          gap="small" 
          pad="small" 
          overflow="hidden" 
          margin="xsmall"
        >
          <AddCircle size="large" color="border" />
          <Heading level="2" textAlign="center" margin="xsmall">
            Register
          </Heading>
        </CardHeader>
        <CardBody 
          pad="medium" 
          justify="center" 
          direction="column" 
          align="center" 
          gap="none"
        >
          <Form
            onSubmit={onSubmitForm}
            onChange={(nextValue) => {
              setValues(nextValue);
            }}
          >
            <FormField name="staff_username" required>
              <TextInput name="staff_username" placeholder="Username" type="text" />
            </FormField>
            <FormField name="staff_password" required>
              <TextInput name="staff_password" placeholder="Password" type="password" />
            </FormField>
            <FormField name="staff_clinic_id" required>
              <TextInput name="staff_clinic_id" placeholder="Clinic ID" type="text" />
            </FormField>
            <FormField name="staff_role" required>
              <Select 
                options={[
                  "Vet",
                  "Nurse",
                  "ACA",
                  "Receptionist"]} 
                placeholder="Job Role" 
                name="staff_role" 
                closeOnChange />
            </FormField>
            <Box align="center" justify="center">
              <Button label="Register" primary type="submit" margin="small" />
            </Box>
          </Form>
        </CardBody>
        <CardFooter 
          align="center"
          direction="column" 
          flex={false} 
          justify="center" 
          gap="small" 
          pad="small">
          <Anchor label="Login" onClick={loginLink}/>
        </CardFooter>
      </Card>
    </Box>
  )
}

export default Register
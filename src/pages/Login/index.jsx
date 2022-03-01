import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Anchor, 
  Box, 
  Button, 
  Card, CardBody, CardHeader, CardFooter, 
  Form, FormField, 
  Heading,
  TextInput } from 'grommet';
import { Lock } from 'grommet-icons';

const Login = ({ setAuth }) => {
  const defaultValues = {
    staff_username: "",
    staff_password: ""
  };

  const [values, setValues] = useState(defaultValues);

  const { 
    staff_username,
    staff_password } = values;

  // Function to handle submission of the login form
  const onSubmitForm = async e => {
    e.preventDefault();
    const login_staff_url = `${process.env.REACT_APP_API_END_POINT}/api/login`;

    // Try to send user data to the server 
    try {
      await axios.post(login_staff_url, {
        username: staff_username,
        password: staff_password
      })
      .then((response) => {
        toast.success(response.data.message);
        const parseRes = response.data

        if (parseRes.token && parseRes.staff_info) {
          localStorage.setItem("token", parseRes.token);
          setAuth(true);
          toast.success("Logged In Successfully");
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

  let navigate = useNavigate();
  
  const registerLink = () => {
    navigate("/register");
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
          <Lock size="large" color="border" />
          <Heading level="2" textAlign="center" margin="xsmall">
            Login
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
            <Box align="center" justify="center">
              <Button label="Login" primary type="submit" margin="small" />
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
          <Anchor label="Register" onClick={registerLink}/>
        </CardFooter>
      </Card>
    </Box>
  )
}

export default Login
import { Link } from "react-router-dom";
import { 
  Anchor, 
  Box, 
  Button, 
  Card, CardBody, CardHeader, CardFooter, 
  Form, FormField, 
  Heading,
  TextInput } from 'grommet';
import { Lock } from 'grommet-icons';

const Login = () => {
  return (
    <Box 
      fill="vertical" 
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
          <Form>
            <FormField name="Username" required>
              <TextInput name="Username" placeholder="Username" type="text" />
            </FormField>
            <FormField name="Password" required>
              <TextInput name="Password" placeholder="Password" type="password" />
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
          <Link to="/register"><Anchor label="Register" /></Link>
        </CardFooter>
      </Card>
    </Box>
  )
}

export default Login
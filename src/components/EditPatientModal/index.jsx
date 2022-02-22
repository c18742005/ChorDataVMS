import { Box, Button, Form, FormField, Heading, Layer, Select, TextInput } from "grommet"

const EditPatientModal = (props) => {
  return (
    <Layer animate modal onClickOutside={props.closeForm} position="center">
      <Heading level="2" textAlign="center">Edit Patient</Heading>
      <Box align="center" justify="center" direction="column" margin="medium">
        <Form>
          <FormField required>
            <TextInput placeholder="Name" size="medium" type="text" plain />
          </FormField>
          <FormField required>
            <Select options={["Canine","Feline"]} closeOnChange placeholder="Species" plain />
          </FormField>
          <FormField required>
            <Select options={["Daschund","Bernese"]} closeOnChange placeholder="Breed" plain />
          </FormField>
          <FormField required>
            <TextInput placeholder="Age" size="medium" type="text" plain />
          </FormField>
          <FormField required>
            <Select options={["MN", "FN", "M", "F"]} closeOnChange placeholder="Sex" plain />
          </FormField>
          <FormField required>
            <TextInput placeholder="Color" size="medium" type="text" plain />
          </FormField>
          <FormField required>
            <TextInput placeholder="Microchip Number" size="medium" type="text" plain />
          </FormField>
          <Box align="center" justify="center" direction="row" gap="small">
            <Button label="Edit" primary hoverIndicator />
            <Button label="Cancel" primary hoverIndicator color="accent-4" onClick={props.closeForm}/>
          </Box>
        </Form>
      </Box>
    </Layer>
  )
}

export default EditPatientModal
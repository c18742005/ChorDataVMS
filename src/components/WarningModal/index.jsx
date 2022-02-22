import { Box, Button, Form, FormField, Heading, Layer, Select, Text } from "grommet"

const WarningModal = (props) => {
  return (
    <Layer animate modal responsive onClickOutside={ props.closeForm } >
      <Heading level="3" color="status-critical" margin="small">
        Warning!
      </Heading>
      <Text textAlign="start" color="status-critical" margin="small">
        {props.type === "client" ? "Client" : "Patient"} will be marked as inactive. Please state a reason for deactivating this account
      </Text>
      <Form>
        <FormField>
          <Select 
            options={props.type === "client" ? ["Client Deceased","Client Relocating","Other"] : ["Patient Deceased", "Patient Rehomed", "Client Relocating", "Other"]} 
            placeholder="Reason"
            closeOnChange />
        </FormField>
        <Box align="end" justify="end" pad="small" direction="row" gap="small">
          <Button 
            label="Deactivate" 
            color="status-critical" 
            hoverIndicator={{"color":"neutral-4","dark":true}} 
            primary 
          />
          <Button 
            label="Cancel" 
            onClick={ props.closeForm }
            primary 
            hoverIndicator 
          />
        </Box>
      </Form>
    </Layer>
  )
}

export default WarningModal
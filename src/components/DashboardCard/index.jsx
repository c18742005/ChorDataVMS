import { Box, Card, Heading } from "grommet"

const DashboardCard = (props) => {
  return (
    <Card hoverIndicator fill>
      <Heading level="3" textAlign="center">
        {props.title}
      </Heading>
      <Box align="center" justify="center">
        {props.image}
      </Box>
    </Card>
  )
}

export default DashboardCard
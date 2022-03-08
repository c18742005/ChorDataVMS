import { Box, Card, Heading } from "grommet"

const DashboardCard = ({ title, image }) => {
  return (
    <Card hoverIndicator fill>
      <Heading level="3" textAlign="center">
        {title}
      </Heading>
      <Box align="center" justify="center">
        {image}
      </Box>
    </Card>
  )
}

export default DashboardCard
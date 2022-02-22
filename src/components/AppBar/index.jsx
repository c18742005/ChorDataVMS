import { Box, Button, Heading, Menu, Header } from 'grommet';
import { UserSettings, LinkPrevious, Menu as MenuIcon } from 'grommet-icons';


const AppBar = (props) => {

  return (
    <Box align="center" justify="center" direction="row" gap="none" fill="horizontal">
      <Header 
        align="center" 
        direction="row" 
        justify="between" 
        gap="none" 
        background={{"color":"brand"}} 
        fill="horizontal" 
        pad={{"horizontal":"xsmall"}}
      >
        <Button icon={props.menuOpen ? <LinkPrevious color='white'/> : <MenuIcon color='white'/>} hoverIndicator onClick={props.handleMenu} />
        <Heading level="1" color="white" textAlign="center">
          ChorData
        </Heading>
        <Menu 
          icon={<UserSettings color='white'/>} 
          items={[{"label":"Current User: "},
            {"label":"Logout"}]} 
        />
      </Header>
    </Box>
  )
}

export default AppBar
import { useEffect, useState } from "react";
import axios from 'axios';
import { 
  Avatar,
  Box, 
  Button, 
  Heading,
  List,
  Select,
  Text } from "grommet";
import { CanineMap } from './canineDental';
import { FelineMap } from './felineDental';
import CanineSrc from '../../assets/CanineDentalChart.png';
import FelineSrc from '../../assets/FelineDentalChart.png';
import ImageMapper from 'react-img-mapper';

/*
  props:
    (String) clinic_id: ID of the clinic the staff currently logged in is part of
    (String) staff_id: ID of the staff currently logged in
*/
const Dentals = ({ clinic_id, staff_id }) => {
  const [patients, setPatients] = useState([]); // Hold patients state
  const [patient, setPatient] = useState({patient_name: ""}); // Hold current patient selected
  const [teeth, setTeeth] = useState([]);
  const [values, setValues] = useState({
    hoveredArea: null, 
    msg: "Interact with image!", 
    moveMsg: null
  });

  const clicked = (area) => {
		setValues({
			msg: `You clicked on tooth ${area.id } at coords ${JSON.stringify(area.coords)}!`
		});
	}

  const clickedOutside = (evt) => {
		const coords = { x: evt.nativeEvent.layerX, y: evt.nativeEvent.layerY };
		setValues({
			msg: `You clicked on the image at coords ${JSON.stringify(coords)}!`
		});
	}
 
  // Fetch patients data from server
  useEffect(() => {
    const fetchData = async () => {
      const get_canines_url = `${process.env.REACT_APP_API_END_POINT}/api/patients/species/Canine/clinic/${clinic_id}`;
      const get_felines_url = `${process.env.REACT_APP_API_END_POINT}/api/patients/species/Feline/clinic/${clinic_id}`;
      let felines = [];
      let canines = [];

      // Attempt to fetch patient data
      try {
        await axios.get(get_canines_url, {
          headers: {
            'token': localStorage.token
          }
        }).then(res => {
          // Success: store results
          canines = res.data;
        });

        await axios.get(get_felines_url, {
          headers: {
            'token': localStorage.token
          }
        }).then(res => {
          // Success: store results
          felines = res.data;
        });

        setPatients([...canines, ...felines])
      } catch (error) {
        setPatients([]);
        console.error(error.message);
      }
    }

    fetchData();
  }, []);

   // Fetch dental data from DB
   useEffect(() => {
    const fetchData = async () => {
      const get_dental_url = `${process.env.REACT_APP_API_END_POINT}/api/dentals/${patient.patient_id}`;

      // Attempt to fetch dental data
      try {
        await axios.get(get_dental_url, {
          headers: {
            'token': localStorage.token
          }
        }).then(res => {
          // Success: store dental results
          setTeeth(res.data)
        });
      } catch (error) {
        setTeeth([]);
        console.error(error.message);
      }
    }

    if(patient.patient_name !== "") {
      fetchData();
    }
  }, [patient]);

  return (
    <Box 
      align="start" 
      justify="start" 
      direction="column" 
      gap="small" 
      pad="small"
      fill 
    >
      <Select
        label="Select Patient" 
        value={patient.patient_name}
        options={patients.map((option) => (`${option.patient_name} - ${option.patient_microchip}`))}
        onChange={({ option }) => {
          let sep = " - "
          let name = option.substring(0, option.indexOf(sep));
          let microchip = option.substring(option.indexOf(sep) + sep.length, option.length)
          // Loop through patients state to find selected drug
          for(let item in patients) {
            if(patients[item].patient_name === name 
              && patients[item].patient_microchip === microchip){
              setPatient(patients[item])
            }
          }
        }}
      />
      { // Only show data when a patient is selected otherwise show an info message
        patient.patient_name !== "" ? (
          <Box align="start" justify="start" direction="column" gap="none">
            <Heading level="2" >
              {patient.patient_name}'s Dental Record
            </Heading>
            <Box align="start" direction="row" gap="none">
              <Box>
                {patient.patient_species === "Canine" ? (
                  <ImageMapper
                    src={CanineSrc}
                    map={CanineMap}
                    width={420}
                    imgWidth={1062}
                    onClick={area => clicked(area)}
                    onImageClick={evt => clickedOutside(evt)}
                    lineWidth={2}
                    strokeColor={"black"}
                    stayHighlighted={true}
                  />
                ) : (
                  <ImageMapper
                    src={FelineSrc}
                    map={FelineMap}
                    width={330}
                    imgWidth={778}
                    onClick={area => clicked(area)}
                    onImageClick={evt => clickedOutside(evt)}
                    lineWidth={2}
                    strokeColor={"black"}
                  />
                )}
              </Box>
              <Box justify="center" fill="vertical">
                <List
                  primaryKey="name"
                  secondaryKey="color"
                  data={[{ 
                    name: 'Gingivitis', 
                    color: <Avatar 
                      align="center" 
                      justify="center" 
                      round="full" 
                      background={{"color":"status-critical"}} 
                      border={{"color":"black","size":"small"}} 
                      size="small" 
                    /> 
                  }, { 
                    name: 'Wear', 
                    color: <Avatar 
                      align="center" 
                      justify="center" 
                      round="full" 
                      background={{"color":"accent-2"}} 
                      border={{"color":"black","size":"small"}} 
                      size="small" 
                    /> 
                  }, { 
                    name: 'Recession', 
                    color: <Avatar 
                      align="center" 
                      justify="center" 
                      round="full" 
                      background={{"color":"accent-4"}} 
                      border={{"color":"black","size":"small"}} 
                      size="small" 
                    /> 
                  }, { 
                    name: 'Furcation', 
                    color: <Avatar 
                      align="center" 
                      justify="center" 
                      round="full" 
                      background={{"color":"status-ok"}} 
                      border={{"color":"black","size":"small"}} 
                      size="small" 
                    /> 
                  }, { 
                    name: 'Fracture', 
                    color: <Avatar 
                      align="center" 
                      justify="center" 
                      round="full" 
                      background={{"color":"neutral-3"}} 
                      border={{"color":"black","size":"small"}} 
                      size="small" 
                    /> 
                  }, { 
                    name: 'FORL', 
                    color: <Avatar 
                      align="center" 
                      justify="center" 
                      round="full" 
                      background={{"color":"neutral-2"}} 
                      border={{"color":"black","size":"small"}} 
                      size="small" 
                    /> 
                  }, { 
                    name: 'Extracted', 
                    color: <Avatar 
                      align="center" 
                      justify="center" 
                      round="full" 
                      background={{"color":"graph-4"}} 
                      border={{"color":"black","size":"small"}} 
                      size="small" 
                    /> 
                  }, { 
                    name: 'Missing', 
                    color: <Avatar 
                      align="center" 
                      justify="center" 
                      round="full" 
                      background={{"color":"black"}} 
                      border={{"color":"black","size":"small"}} 
                      size="small" 
                    /> 
                  }]
                }/>
              </Box>
            </Box>
          </Box>
        ) : (
          <Text color="status-critical" weight="bold">
            Please select a patient from the dropdown menu
          </Text>
        )
      }
      {console.log(values)}
    </Box>
  )
}

export default Dentals
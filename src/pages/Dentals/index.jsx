import axios from "axios";
import { useEffect, useState } from "react";
import { 
  Box,
  Heading,
  Select,
  Text } from "grommet"

// Components
import ImageLegend from "../../components/ImageLegend";
import DentalMap from "../../components/DentalMap";

const Dentals = ({ clinic_id }) => {

  // Set state of patients and currently selected patient
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState({
    patient_id: 0,
    patient_name: "",
    patient_microchip: "",
    patient_species: ""
  });

  // Destructure patient state
  const { 
    patient_id, 
    patient_name,
    patient_microchip,
    patient_species } = patient;

  // Fetch patients data from server
  useEffect(() => {
    const fetchData = async () => {
      let canines = [];
      let felines = [];
      const get_canines_url = `${process.env.REACT_APP_API_END_POINT}/api/patients/species/Canine/clinic/${clinic_id}`;
      const get_felines_url = `${process.env.REACT_APP_API_END_POINT}/api/patients/species/Feline/clinic/${clinic_id}`;

      // Attempt to fetch canine data
      try {
        await axios.get(get_canines_url, {
          headers: {
            'token': localStorage.token
          }
        }).then(res => {
          // Success: set drugs state
          canines = res.data;
        });

        await axios.get(get_felines_url, {
          headers: {
            'token': localStorage.token
          }
        }).then(res => {
          // Success: set drugs state
          felines = res.data;
        });

        setPatients([...canines, ...felines]);

      } catch (error) {
        setPatients([]);
        console.error(error.message);
      }
    }

    fetchData();
  }, [clinic_id]);

  return (
    <Box align="start" justify="start" fill direction="column" gap="small">
      <Box 
        align="center" 
        justify="between" 
        fill="horizontal" 
        direction="row" 
        gap="small"
        pad="small"
      >
        <Heading level="2" pad="none" margin="none" gap="none">
          Dental Record
        </Heading>
      </Box>
      <Select 
        placeholder="Select Patient" 
        options={patients.map((option) => `${option.patient_name} - ${option.patient_microchip}`)}
        value={`${patient_name} - ${patient_microchip}`}
        alignSelf="stretch"
        onChange={({ option }) => {
          // Split the name and microchip number
          let sep = " - ";
          let name = option.substring(0, option.indexOf(sep));
          let microchip = option.substring(option.indexOf(sep) + sep.length, option.length);

          // Loop through patients state to find selected patient
          for(let item in patients) {
            if(patients[item].patient_name === name
              && patients[item].patient_microchip === microchip){
              setPatient(patients[item])
            }
          }
        }}
        closeOnChange 
      />
      {
        patient_species !== "" ? (
          <Box fill>
            <Heading level="2">
              {`${patient_name}'s Dental`}
            </Heading>
            <Box 
              align="start" 
              justify="start" 
              direction="row" 
              gap="medium" 
              responsive
            >
              <DentalMap patient_id={patient_id} species={patient_species} />
              <Box align="center" justify="center" alignSelf="center" responsive>
                <ImageLegend />
              </Box>
            </Box>
          </Box>
        ) : (
          <Text color="status-critical" weight="bold">
            Please select a patient from the dropdown menu
          </Text>
        )
      }
      </Box>
  )
}

export default Dentals
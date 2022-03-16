import { Box, Button, Text } from 'grommet';
import axios from 'axios';
import { useEffect, useState } from "react";
import ImageMapper from 'react-img-mapper';
import SRC from '../../assets/CanineDentalChart.png';
import areas from "./canineDental.json";
import ToothModal from "../../components/ToothModal";
import { toast } from 'react-toastify';

const CanineDentalMap = ({ patient_id }) => {
  const [teeth, setTeeth] = useState([]);
  const [tooth, setTooth] = useState({});
  const [map, setMap] = useState(areas);
  const [showToothModal, setShowToothModal] = useState(false);

  let MAP = {
    name: "my-map",
    areas: map
  };
  
  // Decide which patient dental to load
  useEffect(() => {
    const loadTeeth = async () => {
      setTeeth([]);
      const get_teeth_url = `${process.env.REACT_APP_API_END_POINT}/api/dentals/${patient_id}`;
      
      // Attempt to fetch dental data
      try {
        await axios.get(get_teeth_url, {
          headers: {
            'token': localStorage.token
          }
        }).then(res => {
          // Success: set teeth state
          setTeeth(res.data);
        });
      } catch (error) {
        setTeeth([]);
        console.error(error.message);
      }
    }

    loadTeeth();
  }, [patient_id]);

  // Decide which patient dental to load
  useEffect(() => {
    const loadColors = () => {
      let mapCpy = map;

      areas.forEach(area => {
        teeth.forEach(tooth => {
          if(area.id === tooth.tooth_id) {
            switch(tooth.tooth_problem) {
              case "Gingivitis":
                area.preFillColor = "#DC3202";
                break;
              case "Recession":
                area.preFillColor = "#F0C856";
                break;
              case "Missing":
                area.preFillColor = "#000000";
                break;
              case "Extracted":
                area.preFillColor = "#CCCCCC";
                break;
              case "Wear":
                area.preFillColor = "#EC7004";
                break;
              case "Fracture":
                area.preFillColor = "#04749D";
                break;
              case "Furcation":
                area.preFillColor = "#078376";
                break;
              case "FORL":
                area.preFillColor = "#3E158C";
                break;
              default:
                area.preFillColor = "#FFFFFF";
            }
          }
        })

        area.lineWidth = 3;
        area.strokeColor = "black"
      })

      setMap(mapCpy);
    }

    loadColors();
  }, [teeth]);

  const clicked = area => {
    teeth.forEach(tooth => {
      if(area.id === tooth.tooth_id) {
        setTooth(tooth);
        setShowToothModal(true);
      }
    })
  }

  const updateTooth = (updatedTooth) => {
    // Find the index of the tooth to update
    let index = teeth.findIndex(tooth => tooth.tooth_id === updatedTooth.tooth_id);

    // Create a temp array to store the updated values
    let newTeeth = teeth.slice();

    // Update the state of the teeth
    newTeeth[index] = updatedTooth;
    setTeeth(newTeeth);
  }

  // Function to close tooth modal
  const closeForms = () => {
    setShowToothModal(false);
  }

  // Function to add a new dental
  const addDental = async (id) => {
    const add_dental_url = `${process.env.REACT_APP_API_END_POINT}/api/dentals/${patient_id}`;
      
    // Attempt to add dental data
    try {
      await axios.post(add_dental_url, {}, {
        headers: {
          'token': localStorage.token
        }
      }).then((response) => {
        // Success: Update teeth state
        // Close form and send a success message
        setTeeth(response.data.body)
        toast.success(response.data.message);
      }, (error) => {
        // Error: Check error type
        if(error.response.status === 422) {
          // Display validation errors to the user
          const errors = error.response.data.errors

          errors.forEach((err) => {
            toast.error(err.msg);
          })
        } else {
          // Display single error to user
          toast.error(error.response.data);
        }
      });   
    } catch (error) {
      setTeeth([]);
      console.error(error.message);
    }
  }
  
  return (
    <Box>
      { teeth.length !== 0 ? (
        <ImageMapper 
          src={SRC}
          map={MAP}
          active={true}
          natural={true}
          responsive={true}
          parentWidth={400}
          fillColor="rgba(0, 0, 0, .3)"
          strokeColor="black"
          onClick={(area => clicked(area))}
        />
      ) : (
        <Box fill direction='column' justify='center' align='end' gap='small'>
          <Text color="status-critical" weight="bold">
            No dental available for patient. Do you wish to add a dental file for them? 
          </Text>
          <Button 
          label="Add Dental" 
          hoverIndicator
          primary
          size='medium'
          onClick={() => addDental(patient_id)} 
          />
        </Box>
      )}   
      { // Show tooth modal if required
      showToothModal && (
        <ToothModal
          closeForm={closeForms} 
          tooth={tooth} 
          updateTooth={updateTooth}
        />
      )}
    </Box>
  )
}

export default CanineDentalMap
import { Box, Button, Text } from 'grommet';
import axios from 'axios';
import { useEffect, useState } from "react";
import {ReactComponent as CanineDental}  from '../../assets/CanineDental.svg';
import {ReactComponent as FelineDental}  from '../../assets/FelineDental.svg';
import './style.css';

import ToothModal from "../ToothModal";
import { toast } from 'react-toastify';

const DentalMap = ({ patient_id, species }) => {
  const [teeth, setTeeth] = useState([]);
  const [tooth, setTooth] = useState({});
  const [showToothModal, setShowToothModal] = useState(false);

  // Function to control what happens when a tooth is clicked
  const clicked = tooth_id => {
    // Loop through each tooth to find selected tooth
    teeth.forEach(tooth => {
      // Once found set that tooth to be selected and show the tooth modal
      if(tooth_id === tooth.tooth_id) {
        setTooth(tooth);
        setShowToothModal(true);
      }
    })
  }
  
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

  // Decide which colors to load
  useEffect(() => {
    const loadColors = () => {
      let svgTeeth = document.querySelectorAll("#dental > *");

      // Loop through each tooth and each svg tooth
      svgTeeth.forEach(svgTooth => {
        const toothId = svgTooth.getAttribute("id");
        teeth.forEach((tooth) => {
          // If the tooth matches the svg tooth area then color the tooth
          if(tooth.tooth_id === parseInt(toothId)) {
            // Check which color to color the tooth
            switch(tooth.tooth_problem) {
              case "Gingivitis":
                svgTooth.style.fill = "#FF3F3F"
                break;
              case "Recession":
                svgTooth.style.fill = "#FFFF00"
                break;
              case "Missing":
                svgTooth.style.fill = "#000000"
                break;
              case "Extracted":
                svgTooth.style.fill = "#CCCCCC"
                break;
              case "Wear":
                svgTooth.style.fill = "#FFAA14"
                break;
              case "Fracture":
                svgTooth.style.fill = "#01739D"
                break;
              case "Furcation":
                svgTooth.style.fill = "#02C781"
                break;
              case "FORL":
                svgTooth.style.fill = "#3D148C"
                break;
              default:
                svgTooth.style.fill = "#FFFFFF"
            }
          }
        });

        // Add an onclick listener to open modal on clicking a tooth
        svgTooth.addEventListener("click", () => {
          const toothId = parseInt(svgTooth.getAttribute("id"));
          clicked(toothId)
        });
      });
    }

    loadColors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teeth]);

  // Function to update the selected tooth
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
  const addDental = async () => {
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
          species === "Canine" ? (
            <CanineDental width="100%" />
          ) : (
            <FelineDental width="100%" />
          )
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

export default DentalMap
import { Box } from 'grommet';
import axios from 'axios';
import { useEffect, useState } from "react";
import ImageMapper from 'react-img-mapper';
import SRC from '../../assets/FelineDentalChart.png';
import areas from "./felineDental.json";

const FelineDentalMap = ({ patient_id }) => {
  const [teeth, setTeeth] = useState([]);
  const [map, setMap] = useState(areas);

  const MAP = {
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
    console.log(`Clicked ${area.id}`)
  }
  
  return (
    <Box>
      { teeth.length !== 0 && (
        <ImageMapper 
          src={SRC}
          map={MAP}
          active={true}
          natural={true}
          responsive={true}
          parentWidth={300}
          fillColor="rgba(0, 0, 0, .3)"
          strokeColor="black"
          onClick={(area => clicked(area))}
        />
      )}   
    </Box>
  )
}

export default FelineDentalMap
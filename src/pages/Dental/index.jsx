import { Box } from 'grommet';
import { CanineMap } from './canineDental';
import { FelineMap } from './felineDental';
import CanineSrc from '../../assets/CanineDentalChart.png';
import FelineSrc from '../../assets/FelineDentalChart.png';
import ImageMapper from 'react-image-mapper';
import { useState } from 'react';

const Dental = () => {
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

  return (
    <Box>
      <ImageMapper
        src={FelineSrc}
        map={FelineMap}
        width={500}
        imgWidth={778}
        onClick={area => clicked(area)}
        onImageClick={evt => clickedOutside(evt)}
        lineWidth={2}
        strokeColor={"black"}
      />
      {console.log(values)}
    </Box>
  )
}

export default Dental
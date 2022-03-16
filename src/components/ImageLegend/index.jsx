import { Avatar, List } from "grommet"

const ImageLegend = () => {
  return (
    <List 
      primaryKey="name"
      secondaryKey="color"
      data={[
        {"name":"Extracted", "color":<Avatar background="border" size="small"/>},
        {"name":"FORL", "color":<Avatar background="neutral-2" size="small"/>},
        {"name":"Fracture", "color":<Avatar background="graph-3" size="small"/>},
        {"name":"Furcation", "color":<Avatar background="status-ok" size="small"/>}, 
        {"name":"Gingivitis", "color":<Avatar background="status-critical" size="small"/>}, 
        {"name":"Missing","color":<Avatar background="black" size="small"/>}, 
        {"name":"Recession","color":<Avatar background="yellow" size="small"/>},
        {"name":"Wear", "color":<Avatar background="graph-1" size="small"/>}
      ]} 
    />
  )
}

export default ImageLegend
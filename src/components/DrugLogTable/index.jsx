import { DataTable, Text } from 'grommet';

/*
  props:
    (Array) data: Drug log entries to be displayed in table
*/
const DrugLogTable = ({ data }) => {
  return (
    <DataTable
      columns={[{
          header: <Text color="white" weight="bold">Date</Text>, 
          primary: true, property: "drug_date_administered_f"
        }, {
          header: <Text color="white" weight="bold">Quantity Given</Text>, 
          property: "drug_quantity_given"
        }, {
          header: <Text color="white" weight="bold">Measure</Text>, 
          property: "drug_quantity_measure"
        }, {
          header: <Text color="white" weight="bold">Patient</Text>,
          property: "patient_name", 
        }, {
          header: <Text color="white" weight="bold">Microchip</Text>,
          property: "patient_microchip", 
        }, {
          header: <Text color="white" weight="bold">Batch #</Text>,
          property: "drug_batch_id", 
        }, {
          header: <Text color="white" weight="bold">Staff Member</Text>,
          property: "staff_username"
        }
      ]}
      data={data} 
      pad="small"
      background={{"header":{"color":"brand"}}} 
      border="horizontal"
      margin={{"top": "small"}}
      fill="horizontal"
      step={8}
      paginate
      resizeable 
    />
  )
}

export default DrugLogTable
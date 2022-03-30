import { DataTable, Text } from 'grommet';

/*
  props:
    (Array) data: Drug stock entries to be shown in the table
*/
const DrugStockTable = ({ data }) => {

  return (
    <DataTable
      columns={[{
          header: <Text color="white" weight="bold">Batch</Text>, 
          property: "drug_batch_id", 
        }, {
          header: <Text color="white" weight="bold">Expiry Date</Text>, 
          property: "drug_expiry_date_f"
        }, {
          header: <Text color="white" weight="bold">Quantity Remaining</Text>,
          property: "drug_quantity_remaining"
        }, {
          header: <Text color="white" weight="bold">Measure</Text>,
          property: "drug_quantity_measure"
        }, {
          header: <Text color="white" weight="bold">Concentration</Text>,
          property: "drug_concentration"
        }
      ]}
      data={data} 
      pad="small"
      background={{"header":{"color":"brand"}}} 
      border="horizontal"
      margin={{"top": "small"}}
      fill="horizontal"
      step={7}
      sortable
      resizeable 
      paginate
    />
  )
}

export default DrugStockTable
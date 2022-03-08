import { DataTable, Text } from 'grommet';
import { useEffect, useState } from 'react';
import axios from 'axios';

const DrugStockTable = ({ clinicid, drugid }) => {
  // Set state of current drug selected
  const [drug, setDrug] = useState([]);

  // Fetch drug data from server
  useEffect(() => {
    const fetch_data = async () => {
      const url = `${process.env.REACT_APP_API_END_POINT}/api/drugs/${drugid}/${clinicid}`;

      await axios.get(url, {
          headers: {
            'token': localStorage.token
          }
        }
      ).then(res => {
        // Success: Format date and set drug state
        const drug = res.data;
        drug.forEach(element => {
          element.drug_expiry_date = new Date(element.drug_expiry_date).toLocaleDateString("en-US");
        });
       
        setDrug(drug);
      })
    }

    fetch_data();
  }, [drugid]);

  return (
    <DataTable
      columns={[{
          header: <Text color="white" weight="bold">Batch</Text>, 
          property: "drug_batch_id", 
        }, {
          header: <Text color="white" weight="bold">Expiry Date</Text>, 
          property: "drug_expiry_date"
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
      data={drug} 
      pad="small"
      background={{
        "header":{"color":"brand"},
        "body":["white", "border"]
      }} 
      margin={{"top": "small"}}
      fill="horizontal"
      step={10}
      sortable
      resizeable 
      paginate
    />
  )
}

export default DrugStockTable
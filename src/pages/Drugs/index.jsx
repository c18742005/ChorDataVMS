import { useEffect, useState } from "react";
import axios from 'axios';
import { 
  Anchor,
  Box, 
  Button, 
  Heading,
  NameValueList, 
  NameValuePair, 
  Select, 
  Tab, 
  Tabs,
  Text } from "grommet";

// Components
import AddDrugStock from "../../components/AddDrugStock";
import AdministerDrugModal from "../../components/AdministerDrugModal";
import DrugStockTable from "../../components/DrugStockTable";
import DrugLogTable from "../../components/DrugLogTable";

const Drugs = ({ clinic_id, staff_id }) => {
  const [showAddDrug, setShowAddDrug] = useState(false); // Show add drug modal
  const [showAdminDrug, setShowAdminDrug] = useState(false); // Show administer drug modal
  const[drugs, setDrugs] = useState([]); // Hold state of drugs i.e. Drug name, ID, and side effect link
  const [drug, setDrug] = useState({drug_name: ""}); // Set current drug selected
 
  useEffect(() => {
    const fetchData = async () => {
      const get_drugs_url = `${process.env.REACT_APP_API_END_POINT}/api/drugs`;

      try {
        await axios.get(
          get_drugs_url,
          {
            headers: {
              'token': localStorage.token
            }
          }
        )
        .then(res => {
          setDrugs(res.data);
        })
      } catch (error) {
        console.error(error.message);
      }
    }

    fetchData();
  }, []);

  const closeForms = () => {
    setShowAddDrug(false);
    setShowAdminDrug(false);
  }

  return (
    <Box 
      align="start" 
      justify="start" 
      fill 
      direction="column" 
      gap="small" 
      pad="small"
    >
      <Select
        label="Select Drug" 
        value={drug.drug_name}
        options={drugs.map((option) => option.drug_name)}
        onChange={({ option }) => {
          for(let item in drugs) {
            if(drugs[item].drug_name === option){
              setDrug(drugs[item])
            }
          }
        }}
      />
      {
        drug.drug_name !== "" ? (<>
          <Heading level="2" >
            {drug.drug_name}
          </Heading>
          <Box 
            align="center" 
            justify="center" 
            direction="row" 
            gap="small" 
            margin={{"bottom":"medium"}}
          >
            <Button 
              label="Add Stock" 
              hoverIndicator
              onClick={() => setShowAddDrug(true)} 
            />
            <Button 
              label="Administer Drug"
              hoverIndicator 
              onClick={() => setShowAdminDrug(true)}
            />
          </Box>
          <Tabs justify="start" fill="horizontal">
            <Tab title="Drug Info">
              <Box 
              align="center" 
              justify="center" 
              fill="horizontal" 
              border={{"color":"border"}} 
              elevation="medium" 
              round="small" 
              pad="medium" 
              margin={{"top":"small"}} 
              flex="grow"
            >
                <NameValueList layout="column">
                  <NameValuePair name="Side Effects:"> 
                    <Anchor href={drug.drug_link} target="_blank">{drug.drug_link}</Anchor>
                  </NameValuePair>
                </NameValueList>
                <DrugStockTable clinicid={clinic_id} drugid={drug.drug_id} />
              </Box>
            </Tab>
            <Tab title="Drug Log">
              <Box 
                align="start" 
                justify="start" 
                fill="horizontal" 
                border={{"color":"border"}} 
                elevation="medium" 
                round="small" 
                pad="medium" 
                margin={{"top":"small"}} 
              >
                <DrugLogTable clinicId={clinic_id} drugId={drug.drug_id} />
              </Box>
            </Tab>
          </Tabs></>
        ) : (
          <Text color="status-critical" weight="bold">Please select a drug from the dropdown menu</Text>
        )
      }
      
      {showAddDrug && (
        <AddDrugStock
          closeForm={closeForms} 
          clinic_id={clinic_id} 
          drug={drug}
        />
      )}

      {showAdminDrug && (
        <AdministerDrugModal
          closeForm={closeForms} 
          clinic_id={clinic_id} 
          staff_id={staff_id}
          drug={drug}
        />
      )}
    </Box>
  )
}

export default Drugs
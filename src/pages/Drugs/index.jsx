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
  const [showAddDrug, setShowAddDrug] = useState(false); // Show add drug modal state
  const [showAdminDrug, setShowAdminDrug] = useState(false); // Show administer drug modal state
  const[drugs, setDrugs] = useState([]); // Hold drugs state
  const [drug, setDrug] = useState({drug_name: ""}); // Hold current drug selected
 
  // Fetch drug data from server
  useEffect(() => {
    const fetchData = async () => {
      const get_drugs_url = `${process.env.REACT_APP_API_END_POINT}/api/drugs`;

      // Attempt to fetch drugs data
      try {
        await axios.get(get_drugs_url, {
          headers: {
            'token': localStorage.token
          }
        }).then(res => {
          // Success: set drugs state
          setDrugs(res.data);
        });

      } catch (error) {
        console.error(error.message);
      }
    }

    fetchData();
  }, []);

  // Function to close add drug and administer drug modals
  const closeForms = () => {
    setShowAddDrug(false);
    setShowAdminDrug(false);
  }

  return (
    <Box 
      align="start" 
      justify="start" 
      direction="column" 
      gap="small" 
      pad="small"
      fill 
    >
      <Select
        label="Select Drug" 
        value={drug.drug_name}
        options={drugs.map((option) => option.drug_name)}
        onChange={({ option }) => {
          // Loop through drugs state to find selected drug
          for(let item in drugs) {
            if(drugs[item].drug_name === option){
              setDrug(drugs[item])
            }
          }
        }}
      />
      { // Only show data when a drug is selected otherwise show an info message
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
          <Text color="status-critical" weight="bold">
            Please select a drug from the dropdown menu
          </Text>
        )
      }
      
      { // Show add drug modal if required
      showAddDrug && (
        <AddDrugStock
          closeForm={closeForms} 
          clinic_id={clinic_id} 
          drug={drug}
        />
      )}

      { // Show administer drug modal if required
      showAdminDrug && (
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
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

/*
  props:
    (String) clinic_id: ID of the clinic the staff currently logged in is part of
    (String) staff_id: ID of the staff currently logged in
*/
const Drugs = ({ clinic_id, staff_id }) => {
  const [showAddDrug, setShowAddDrug] = useState(false); // Show add drug modal state
  const [showAdminDrug, setShowAdminDrug] = useState(false); // Show administer drug modal state
  const[drugs, setDrugs] = useState([]); // Hold drugs state
  const [drug, setDrug] = useState({drug_name: ""}); // Hold current drug selected
  const [drugStock, setDrugStock] = useState([]); // Hold drug stock of current drug
  const [drugLog, setDrugLog] = useState([]); // Hold log of current drug
 
  // Fetch drugs data from server
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

  // Fetch drug stock and log data from server
  useEffect(() => {
    if(drug.drug_name !== "") {
      const fetch_data = async () => {
        const drug_stock_url = `${process.env.REACT_APP_API_END_POINT}/api/drugs/${drug.drug_id}/${clinic_id}`;
        const drug_log_url = `${process.env.REACT_APP_API_END_POINT}/api/drugs/log/${drug.drug_id}/${clinic_id}`;
  
        // Fetch the drug stock of the currently selected drug
        await axios.get(drug_stock_url, {
          headers: {
            'token': localStorage.token
          }
        }).then(res => {
          // Success: Format date and set drug state
          const drug_stock = res.data;
          drug_stock.forEach(element => {
            element.drug_expiry_date_f = new Date(element.drug_expiry_date).toLocaleDateString("en-IE");
          });
          
          setDrugStock(drug_stock);
        });

        // Fetch the drug log of the currently selected drug
        await axios.get(drug_log_url, {
          headers: {
            'token': localStorage.token
          }
        }).then(res => {
          // Success: Format date and set drug log state
          const drug_log = res.data;
          drug_log.forEach(element => {
            element.drug_date_administered_f = new Date(element.drug_date_administered).toLocaleDateString("en-IE");
          });
        
          setDrugLog(drug_log);
        });
      }
  
      fetch_data();
    }
  }, [drug, clinic_id]);

  // Function to add stock to the drugStock state
  const addToDrugStock = (newStock) => {
    // Change the date to a formatted string
    newStock.drug_expiry_date_f = new Date(newStock.drug_expiry_date).toLocaleDateString("en-IE");

    setDrugStock([...drugStock, newStock]);
  }

  // Function to add a log to the drugLog state
  const addToDrugLog = (newLog) => {
    // Change the date to a formatted string
    newLog.drug_date_administered_f = new Date(newLog.drug_date_administered).toLocaleDateString("en-IE");

    setDrugLog([newLog, ...drugLog]);
  }

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
      fill 
    >
      <Box 
        align="center" 
        justify="between" 
        fill="horizontal" 
        direction="row" 
        gap="small"
        pad="small"
      >
        <Heading level="2" pad="none" margin="none" gap="none">Drug Record</Heading>
      </Box>
      <Select
        label="Select Drug" 
        placeholder="Select Drug"
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
          <Heading level="3" margin="small" gap="none">
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
                <DrugStockTable data={drugStock}/>
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
                <DrugLogTable data={drugLog} />
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
          addStock={addToDrugStock}
          drug={drug}
        />
      )}

      { // Show administer drug modal if required
      showAdminDrug && (
        <AdministerDrugModal
          closeForm={closeForms} 
          clinic_id={clinic_id} 
          staff_id={staff_id}
          addLog={addToDrugLog}
          drug={drug}
        />
      )}
    </Box>
  )
}

export default Drugs
import { useEffect, useState } from "react";
import axios from 'axios';
import { 
  Anchor,
  Box, 
  Button, 
  DataTable, 
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

const Drugs = ({ clinic_id, staff_id }) => {
  const [showAddDrug, setShowAddDrug] = useState(false);
  const [showAdminDrug, setShowAdminDrug] = useState(false);
  const[drugs, setDrugs] = useState([]);
  const [drug, setDrug] = useState({drug_name: "" });
  const [drugNames, setDrugNames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const get_drugs_url = `${process.env.REACT_APP_API_END_POINT}/api/drugs`;

      try {
        await axios.get(get_drugs_url)
        .then(res => {
          setDrugs(res.data);
          setDrugNames(res.data.map(drug => drug.drug_name))
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
        options={drugNames}
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
                  <NameValuePair name="Side Effects"> 
                    <Anchor href={drug.drug_link} target="_blank">{drug.drug_link}</Anchor>
                  </NameValuePair>
                  <NameValuePair name="Amount in Stock">
                    <Text>5 x 1000mg</Text>
                  </NameValuePair>
                </NameValueList>
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
                <DataTable
                  columns={[
                    {
                      header: <Text color="white" weight="bold">Drug Name</Text>, 
                      primary: true, property: "drug_name"
                    },
                    {
                      header: <Text color="white" weight="bold">Quantity Given</Text>, 
                      property: "quantity_administered"},
                    {
                      header: <Text color="white" weight="bold">Patient</Text>,
                      property: "patient", 
                    },
                    {
                      header: <Text color="white" weight="bold">Batch #</Text>,
                      property: "batch_number", 
                    },
                    {
                      header: <Text color="white" weight="bold">Staff Member</Text>,
                      property: "staff_administer"
                    }]}
                  data={[{
                    "drug_name":"Paracetamol",
                    "quantity_administered":5,
                    "patient":"Jasmine",
                    "batch_number":12345,
                    "staff_administer":"ruth_ferrie"}, 
                  {
                    "drug_name":"Paracetamol",
                    "quantity_administered":5,
                    "patient":"Jasmine",
                    "batch_number":12345,
                    "staff_administer":"ruth_ferrie"
                  }, 
                  {
                    "drug_name":"Paracetamol",
                    "quantity_administered":5,
                    "patient":"Jasmine",
                    "batch_number":12345,
                    "staff_administer":"ruth_ferrie"
                  }, 
                  {
                    "drug_name":"Paracetamol",
                    "quantity_administered":5,
                    "patient":"Jasmine",
                    "batch_number":12345,
                    "staff_administer":"ruth_ferrie"
                  }, {
                    "drug_name":"Paracetamol",
                    "quantity_administered":5,
                    "patient":"Jasmine",
                    "batch_number":12345,
                    "staff_administer":"ruth_ferrie"
                  },]} 
                  background={{
                    "header":{"color":"brand"},
                    "body":["white", "border"]
                  }} 
                  pad="xsmall" 
                  paginate 
                  step={10}
                  resizeable 
                  sortable 
                />
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
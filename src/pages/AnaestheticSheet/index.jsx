import { Box, DataTable, Heading, Text } from 'grommet';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend } from 'recharts';
import { toast } from 'react-toastify';

const AnaestheticSheet = () => {
  // Get anaesthetic ID from URL parameters
  const { anaestheticId } = useParams();

  // Hold state of chart, table, and anaesthetic sheet
  const [sheetInfo, setSheetInfo] = useState({
    patient_name: "Patient",
    anaesthetic_date: new Date().toISOString(),

  })
  const [chartData, setChartData] = useState([]);
  const [tableColumns, setTableColumns] = useState([{
    header: <Text color="white" weight="bold">Parameter</Text>, 
    property: "value", 
    primary: true
  }]);

  const [tableData, setTableData] = useState([
    {value: "Heart Rate (BPM)"}, 
    {value: "Resp. Rate (BPM)"},
    {value: "Oxygen Flow (L)"}, 
    {value: "Anaesthetic Agent (%)"}, 
    {value: "Eye Pos"}, 
    {value: "Reflexes"}
  ]);

  // Fetch anaesthetic sheet data from server
  useEffect(() => {
    const fetchData = async () => {
      const get_anaesthetic_sheet_url = `${process.env.REACT_APP_API_END_POINT}/api/patient/anaesthetic/${anaestheticId}`;

      // Attempt to fetch sheet data
      try {
        await axios.get(get_anaesthetic_sheet_url, {
          headers: {
            'token': localStorage.token
          }
        }).then(res => {
          // Success: Set the state of the table and graph
          let anaesthetic_date = new Date(
            res.data.anaesthetic_sheet.anaesthetic_date).toLocaleDateString("en-IE");
          setSheetInfo({...res.data.anaesthetic_sheet, anaesthetic_date_f: anaesthetic_date});
          
          // Initialise the values to be used in the graph and tables
          let chart_data = []
          let table_columns = []
          let hr_row = {"value":"Heart Rate (BPM)"};
          let rr_row = {"value":"Resp. Rate (BPM)"};
          let oxygen_row = {"value":"Oxygen Flow (L)"};
          let agent_row = {"value":"Anaesthetic Agent (%)"};
          let eye_pos_row = {"value":"Eye Pos"};
          let reflexes_row = {"value":"Reflexes"};

          res.data.anaesthetic_periods.forEach(element => {
            // Define a new chart object
            let chart_obj = {
              name: parseInt(element.anaesthetic_period),
              hr: parseInt(element.anaesthetic_hr),
              rr: parseInt(element.anaesthetic_rr)
            };
            chart_data.push(chart_obj);

            // Define a new column for the period
            let new_column = {
              header: <Text color="white" weight="bold">{element.anaesthetic_period.toString()}</Text>, 
              property: element.anaesthetic_period.toString(), 
              units: "min"
            };
            table_columns.push(new_column);

            // Define the table rows
            hr_row = {...hr_row, [element.anaesthetic_period]: element.anaesthetic_hr};
            rr_row = {...rr_row, [element.anaesthetic_period]: element.anaesthetic_rr};
            oxygen_row = {...oxygen_row, [element.anaesthetic_period]: element.anaesthetic_oxygen};
            agent_row = {...agent_row, [element.anaesthetic_period]: element.anaesthetic_agent};
            eye_pos_row = {...eye_pos_row, [element.anaesthetic_period]: element.anaesthetic_eye_pos};
            reflexes_row = {
              ...reflexes_row, 
              [element.anaesthetic_period]: element.anaesthetic_reflexes === true ? "Yes" : "No"
            };
          });

          // Set the state of the chart and table 
          setChartData(chart_data);
          setTableColumns([...tableColumns, ...table_columns]);
          setTableData([hr_row, rr_row, oxygen_row, agent_row, eye_pos_row, reflexes_row]);
        });

      } catch (error) {
        setChartData([]);
        setTableColumns([{
          header: <Text color="white" weight="bold">Parameter</Text>, 
          property: "value", 
          primary: true
        }]);
        setTableData([
          {value: "Heart Rate (BPM)"}, 
          {value: "Resp. Rate (BPM)"},
          {value: "Oxygen Flow (L)"}, 
          {value: "Anaesthetic Agent (%)"}, 
          {value: "Eye Pos"}, 
          {value: "Reflexes"}
        ]);
        toast.error(error.message);
        console.error(error.message);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anaestheticId]);

  return (
    <Box align="start" justify="start" fill direction="column" gap="small">
      <Box 
        align="start" 
        justify="between" 
        fill="horizontal" 
        direction="column" 
        gap="small"
        pad="small"
      >
        <Heading 
          level="2" 
          pad="none" 
          margin="none" 
          gap="none">{sheetInfo.patient_name}'s Anaesthetic Sheet - {sheetInfo.anaesthetic_date_f}
        </Heading>
        <ResponsiveContainer minWidth={100} minHeight={300} height="38%" width="90%">
          <LineChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Legend iconType="circle"/>
            <Tooltip />
            <Line type="monotone" dataKey="hr" stroke="#FF4040" />
            <Line type="monotone" dataKey="rr" stroke="#00C781" />
          </LineChart>
        </ResponsiveContainer>
        <DataTable
          columns={tableColumns}
          data={tableData} 
          background={{"header":{"color":"brand"}}} 
          border="horizontal"
        />
      </Box>
    </Box>
  )
}

export default AnaestheticSheet
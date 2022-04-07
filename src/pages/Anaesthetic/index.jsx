import { 
  Box, 
  Button,
  DataTable,
  Form,
  FormField,
  Heading,
  RadioButtonGroup,
  RangeInput,
  Select,
  Text } from 'grommet'
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import axios from "axios";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend } from 'recharts';
import AnaestheticTable from '../../components/AnaestheticTable';

const Anaesthetic = ({ clinic_id, staff_id }) => {

  // Set state of patients and currently selected patient
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState({
    patient_id: false,
    patient_name: "",
    patient_microchip: ""
  });
  //set state of anaesthetic status
  const [startAnaesthetic, setStartAnaesthetic] = useState(false);
  // Hold state of form values
  const [values, setValues] = useState({
    anaesthetic_id: 0,
    interval: 0,
    hr: 0,
    rr: 0,
    oxygen: 0,
    anaesthetic: 0,
    eyePos: "Central",
    reflexes: "No"
  })
  
  // Hold state of column values
  const [dataColumns, setDataColumns] = useState([
    {header: <Text color="white" weight="bold">Parameter</Text>, property: "value", primary: true}
  ]);
  const [hrColumn, setHrColumn] = useState({"value":"Heart Rate (BPM)"});
  const [rrColumn, setRrColumn] = useState({"value":"Resp. Rate (BPM)"});
  const [oxygenColumn, setOxygenColumn] = useState({"value":"Oxygen Flow (L)"});
  const [anaestheticColumn, setAnaestheticColumn] = useState({"value":"Anaesthetic Agent (%)"});
  const [eyePosColumn, setEyePosColumn] = useState({"value":"Eye Pos"});
  const [reflexesColumn, setReflexesColumn] = useState({"value":"Reflexes"});

  // Hold state of data for the table and the chart
  const [data, setData] = useState([
    hrColumn, 
    rrColumn, 
    oxygenColumn, 
    anaestheticColumn, 
    eyePosColumn, 
    reflexesColumn
  ]);
  const [chartData, setChartData] = useState([])

  // Destructure patient state
  const { 
    patient_id, 
    patient_name,
    patient_microchip } = patient;

  // Fetch patients data from server
  useEffect(() => {
    const fetchData = async () => {
      const get_patients_url = `${process.env.REACT_APP_API_END_POINT}/api/patients/clinic/${clinic_id}`;

      // Attempt to fetch patients data
      try {
        await axios.get(get_patients_url, {
          headers: {
            'token': localStorage.token
          }
        }).then(res => {
          // Success: set patients state
           setPatients(res.data);
        });

      } catch (error) {
        setPatients([]);
        console.error(error.message);
      }
    }

    fetchData();
  }, [clinic_id]);

  // Function to add a column to the data table and store it in the database
  const addToTable = async () => {
    const add_period_url = `${process.env.REACT_APP_API_END_POINT}/api/anaesthetic/period`;

    // Attempt to add anaesthetic period to DB
    try {
      await axios.post(add_period_url, {
        id: values.anaesthetic_id,
        interval: values.interval,
        hr: values.hr,
        rr: values.rr,
        oxygen: parseFloat(values.oxygen),
        agent: parseFloat(values.anaesthetic),
        eye_pos: values.eyePos,
        reflexes: values.reflexes
      }, {
        headers: {
          'token': localStorage.token
      }})
      .then((response) => {
        // Increment the interval by 5 mins
        setValues({...values, interval: (values.interval + 5)});

        // Initialise new column values and set its state
        let newColumn = { 
          header: <Text color="white" weight="bold">{values.interval.toString()}</Text>, 
          property: values.interval.toString(),
          units: "min"
        }
        setDataColumns([...dataColumns, newColumn]);

        // Initialise all new values for column
        let prop = values.interval.toString()
        let newHrColumn = {...hrColumn, [prop]: parseInt(values.hr)}
        let newRrColumn = {...rrColumn, [prop]: parseInt(values.rr)}
        let newOxyColumn = {...oxygenColumn, [prop]: values.oxygen}
        let newAnaestheticColumn = {...anaestheticColumn, [prop]: values.anaesthetic}
        let newEyePosColumn = {...eyePosColumn, [prop]: values.eyePos}
        let newReflexesColumn = {...reflexesColumn, [prop]: values.reflexes}

        // Add new values to table
        setHrColumn(newHrColumn);
        setRrColumn(newRrColumn);
        setOxygenColumn(newOxyColumn);
        setAnaestheticColumn(newAnaestheticColumn);
        setEyePosColumn(newEyePosColumn);
        setReflexesColumn(newReflexesColumn);

        // Initialise new data for the table and chart then set its state
        let newChartData = {name: prop, hr: parseInt(values.hr), rr: parseInt(values.rr)};
        setData([newHrColumn, newRrColumn, newOxyColumn, newAnaestheticColumn, newEyePosColumn, newReflexesColumn])
        setChartData([...chartData, newChartData]);
      }, (error) => {
        // Error: Check error type
        if(error.response.status === 422) {
          // Output validation errors to the user
          const errors = error.response.data.errors

          errors.forEach((err) => {
            toast.error(err.msg);
          })
        } else {
          // Output single error to user
          toast.error(error.response.data);
        }
      })
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    }
  }

  // Function to add an anaesthetic sheet to the DB
  const addAnaestheticSheet = async () => {
    const add_anaesthetic_url = `${process.env.REACT_APP_API_END_POINT}/api/anaesthetic`;

    // Attempt to add anaesthetic sheet to DB
    try {
      await axios.post(add_anaesthetic_url, {
        patient_id: patient_id,
        staff_id: staff_id
      }, {
        headers: {
          'token': localStorage.token
      }})
      .then((response) => {
        // Success: Update anaesthetic state and start anaesthetic
        setValues({...values, anaesthetic_id: response.data.body.anaesthetic_id})
        toast.success(response.data.message);
        setStartAnaesthetic(true)
      }, (error) => {
        // Error: Check error type
        if(error.response.status === 422) {
          // Display validation errors to user
          const errors = error.response.data.errors

          errors.forEach((err) => {
            toast.error(err.msg);
          })
        } else {
          // Display single error to user
          toast.error(error.response.data);
        }
      })
    } catch (error) {
      toast.error(error);
      console.error(error);
    }
  }

  // Function that is called once anaesthetic is complete
  const finishAnaesthetic = () => {
    // Reset form values
    setValues({
      anaesthetic_id: 0,
      interval: 0,
      hr: 0,
      rr: 0,
      oxygen: 0,
      anaesthetic: 0,
      eyePos: "Central",
      reflexes: "No"
    });

    // Reset column and data values
    setDataColumns([{header: <Text color="white" weight="bold">Parameter</Text>, property: "value", primary: true}])
    setHrColumn({"value":"Heart Rate (BPM)"});
    setRrColumn({"value":"Resp. Rate (BPM)"});
    setOxygenColumn({"value":"Oxygen Flow (L)"});
    setAnaestheticColumn({"value":"Anaesthetic Agent (%)"});
    setEyePosColumn({"value":"Eye Pos"});
    setReflexesColumn({"value":"Reflexes"});

    // Hold state of data for the table and the chart
    setData([hrColumn, rrColumn, oxygenColumn, anaestheticColumn, eyePosColumn, reflexesColumn]);
    setChartData([]);

    // Return to patient page
    setStartAnaesthetic(false);
    toast.success("Anaesthetic completed")
  }

  return (
    <Box align="start" justify="start" fill direction="column" gap="small">
      <Box 
        align="center" 
        justify="between" 
        fill="horizontal" 
        direction="row" 
        gap="small"
        pad="small"
      >
        <Heading 
          level="2" 
          pad="none" 
          margin="none" 
          gap="none">
            Anaesthetic Monitoring
        </Heading>
      </Box>
      {!startAnaesthetic && (
        <Box gap='small'>
          <Select 
            placeholder="Select Patient" 
            options={patients.map((option) => `${option.patient_name} - ${option.patient_microchip}`)}
            value={`${patient_name} - ${patient_microchip}`}
            alignSelf="stretch"
            onChange={({ option }) => {
              // Split the name and microchip number
              let sep = " - ";
              let name = option.substring(0, option.indexOf(sep));
              let microchip = option.substring(option.indexOf(sep) + sep.length, option.length);

              // Loop through patients state to find selected patient
              for(let item in patients) {
                if(patients[item].patient_name === name
                  && patients[item].patient_microchip === microchip){
                  setPatient(patients[item])
                }
              }
            }}
            closeOnChange 
          />
          <Button 
            label="Start Anaesthetic" 
            disabled={!patient.patient_id}
            hoverIndicator 
            primary 
            onClick={() => addAnaestheticSheet()} 
          />

          {patient_id && (
            <>
              <Heading level="3" margin="small" gap="none">
                {patient.patient_name}
              </Heading>
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
                <AnaestheticTable patient_id={patient_id}/>
              </Box>
            </>
          )}

        </Box>
      )}
      {startAnaesthetic && (
        <Box align="center" flex="grow" direction="column">
        <Box align="start" justify="start" direction="row" gap="none" fill flex="grow">
          <Box align="center" justify="start" direction="column" flex="grow">
            <Form>
              <FormField label="Heart Rate (BPM)">
                <Text>{values.hr}</Text>
                <RangeInput 
                  name="hr"
                  max={400} 
                  min={0} 
                  step={1} 
                  value={values.hr} 
                  onChange={evt => setValues({...values, hr: evt.target.value})} 
                />
              </FormField>
              <FormField label="Resp. Rate (BPM)">
                <Text>{values.rr}</Text>
                <RangeInput 
                  name="rr"
                  max={100} 
                  min={0} 
                  step={1} 
                  value={values.rr} 
                  onChange={evt => setValues({...values, rr: evt.target.value})} 
                />
              </FormField>
              <FormField label="Oxygen Flow (L)">
                <Text>{values.oxygen}</Text>
                <RangeInput 
                  name="oxygen"
                  max={10} 
                  min={0} 
                  step={0.25} 
                  value={values.oxygen} 
                  onChange={evt => setValues({...values, oxygen: evt.target.value})} 
                />
              </FormField>
              <FormField label="Anaesthetic Agent (%)">
                <Text>{values.anaesthetic}</Text>
                <RangeInput 
                  name="anaesthetic"
                  max={5} 
                  min={0} 
                  step={0.25} 
                  value={values.anaesthetic} 
                  onChange={evt => setValues({...values, anaesthetic: evt.target.value})} 
                />
              </FormField>
              <FormField label="Eye Pos">
                <RadioButtonGroup 
                  name="eyePos" 
                  options={["Central","Ventral"]} 
                  value={values.eyePos}
                  onChange={evt => setValues({...values, eyePos: evt.target.value})} 
                />
              </FormField>
              <FormField label="Reflexes">
                <RadioButtonGroup 
                  name="reflexes" 
                  options={["Yes","No"]} 
                  value={values.reflexes}
                  onChange={evt => setValues({...values, reflexes: evt.target.value})} 
                />
              </FormField>
              <Box align="center" justify="center" direction="column" gap="none" margin="xsmall">
                <Button label="Submit Values" primary hoverIndicator onClick={() => addToTable()} />
              </Box>
            </Form>
          </Box>
          <Box 
            align="center" 
            justify="start" 
            elevation="medium" 
            round="medium" 
            direction="column" 
            margin="medium"
            gap="small"
            pad="medium"
            fill="horizontal"
            overflow="auto"
          >
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
            <Box overflow="auto">
              <DataTable
                columns={dataColumns}
                data={data} 
                background={{"header":{"color":"brand"}}} 
                border="horizontal"
              />
            </Box>
            <Box align="end" justify="center" fill="horizontal" pad="xsmall">
              <Button 
                label="Complete Anaesthetic" 
                color="status-critical"  
                hoverIndicator={{"color":"neutral-4","dark":true}} 
                onClick={() => {finishAnaesthetic()}}
                primary />
            </Box>
          </Box>
        </Box>
      </Box>
      )}
    </Box>
  )
}

export default Anaesthetic
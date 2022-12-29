import React from 'react'
import { FaCalendarAlt } from 'react-icons/fa';
import { GoSettings } from 'react-icons/go';
import { DateRangePicker } from 'react-date-range';
import { addDays, subDays, format } from "date-fns";
import Table from './components/elements/Table';
import { useDispatch, useSelector } from 'react-redux';
import { dateData } from './reducers/data';
import { headerData } from './reducers/tableHead';
import { tableDataSort } from './reducers/dataSort';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css'; 
import './App.css';

function App() {
// draggable settings
  const settingDispatch = useDispatch();
  const tableDataView = useSelector((state)=>state.tableHead.value);
  const tableDataSortted = useSelector((state)=>state.dataSort.value);
  // const [settingList, setSettingList] = React.useState(['Date', 'App Name', 'AD Request', 'AD Response', 'Impression', 'Clicks', 'Revenue', 'Fill Rate', 'CTR'])
  const dragItem = React.useRef(null);
  const dragOverItem = React.useRef(null);

  const indexDispatch = useDispatch();
  const handleDrag = () => {
    let dataItems = [...tableDataView];
    let dataIndexes = [...tableDataSortted];

    const draggableItemContent = dataItems.splice(dragItem.current,1)[0];
    const draggableIndexContent = dataIndexes.splice(dragItem.current,1)[0];

    dataItems.splice(dragOverItem.current, 0, draggableItemContent);
    dataIndexes.splice(dragOverItem.current, 0, draggableIndexContent);

    dragItem.current=null;
    dragOverItem.current=null;

    // setSettingList(dataItems);
    settingDispatch(headerData(dataItems));
    indexDispatch(tableDataSort(dataIndexes));

    console.log(tableDataView);
  }

  const dispatch = useDispatch();
  const dataView = useSelector((state)=>state.data.value);

  //data fetching
  const [fetchLink, setFetchLink] = React.useState('');

  const handleOnChange = (ranges) => {
    const { selection } = ranges;
    // onChange(selection);
    setSelectionRange([selection]);
    console.log(selection);
    setFetchLink(`http://go-dev.greedygame.com/v3/dummy/report?startDate=${format(selection.startDate, 'yyyy-MM-dd')}&endDate=${format(selection.endDate, 'yyyy-MM-dd')}`);
    console.log(fetchLink);
  };

  //toggle 
  const [toggleDatePicker, setToggleDatePicker] = React.useState(false);
  const [openSetting, setOpenSetting] = React.useState(true);

  //date-selection
  const [selectionRange,setSelectionRange] = React.useState([{
    startDate: subDays(new Date(), 7),
    endDate: addDays(new Date(), 1),
    key: "selection"
  }]);
  

 //fetch request

  React.useEffect(() => {
    fetch(`${fetchLink}`)
    .then(response => response.json())
    .then(data => 
      {
        // adding fill_rate and ctr to the array
        const updatedDataView = data.data.map(v=>{
          const fill_rate = (v.requests/v.responses)*100;
          const ctr = (v.clicks/v.impressions)*100;
          return({...v,fill_rate:fill_rate,ctr:ctr})
        })
        return dispatch(dateData(updatedDataView))
      }
      )
  },[selectionRange])

  return (
    <div className="App">
      <div style={{backgroundColor:'#00000F',width:'5%'}}></div>
      <div style={{width:'95%',margin:'0 1.4%',marginTop:'2.5%'}}>
        <div style={{fontWeight:'700',fontSize:'18px',marginBottom:'1%'}}>Analytics</div>
        <div className='date__container'>
          {toggleDatePicker && <DateRangePicker
            className='date__picker'
            onChange={handleOnChange}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            ranges={selectionRange}
          />}
          <button className='datePicker__button' onClick={()=>setToggleDatePicker(!toggleDatePicker)}><FaCalendarAlt size={15} color='rgb(61, 145, 255)'/>date</button>
          <button className='datePicker__button' onClick={()=>setOpenSetting(!openSetting)}><GoSettings size={16} color='rgb(61, 145, 255)'/>settings</button>
        </div>
        <div>
          {openSetting && <div className='setting_container'>
            <div>Dimensions and Metrics</div>
            <div className='setting_sort'>
              {tableDataView?.map((item,index)=>(
                <button 
                  className='datePicker__button'
                  key={index} 
                  draggable 
                  onDragStart={(e) => (dragItem.current=index)} 
                  onDragEnter={(e) => (dragOverItem.current=index)}
                  onDragEnd={handleDrag}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {item}
                </button>
              ))}
            </div>
            <div style={{display:'flex',gap:'8px',width:'100%',justifyContent:'flex-end'}}>
              <button onClick={()=>setOpenSetting(false)} className='datePicker__button' style={{color:'rgb(61, 145, 255)'}}>cancel</button>
              <button onClick={()=>setOpenSetting(false)} className='datePicker__button' style={{backgroundColor:'rgb(61, 145, 255)',color:'#fff'}}>apply changes</button>
            </div>
          </div>}
        </div>
        <Table/>
      </div>
    </div>
  );
}

export default App;

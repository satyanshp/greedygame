import React from 'react'
import { FaCalendarAlt } from 'react-icons/fa';
import { GoSettings } from 'react-icons/go';
import { DateRangePicker } from 'react-date-range';
import { addDays, subDays, format, differenceInDays, parseISO } from "date-fns";
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

    let dataItemsDragIndex = dataItems.findIndex(x=>x.value===dragItem.current);
    let dataItemsDragOverIndex = dataItems.findIndex(x=>x.value===dragOverItem.current);

    let dataIndexesDragIndex = dataIndexes.indexOf(dragItem.current)
    let dataIndexesDragOverIndex = dataIndexes.indexOf(dragOverItem.current)

    const draggableItemContent = dataItems.splice(dataItemsDragIndex,1)[0];
    dataItems.splice(dataItemsDragOverIndex, 0, draggableItemContent);
    
    if(dataIndexes.includes(dragItem.current) && dataIndexes.includes(dragOverItem.current)){
      const draggableIndexContent = dataIndexes.splice(dataIndexesDragIndex,1)[0];
      dataIndexes.splice(dataIndexesDragOverIndex, 0, draggableIndexContent);
    }

    dragItem.current=null;
    dragOverItem.current=null;

    // setSettingList(dataItems);
    settingDispatch(headerData(dataItems));
    indexDispatch(tableDataSort(dataIndexes));

    // console.log(tableDataView);
    console.log(dataItemsDragIndex);
    console.log(dataItemsDragOverIndex);
  }

  const dispatch = useDispatch();
  const dataView = useSelector((state)=>state.data.value);

  const [diffInDays, setDiffInDays] = React.useState();

  const [startEndDate, setStartEndDate] = React.useState({
    startDate:'',
    endDate:''
  })

  //data fetching
  const [fetchLink, setFetchLink] = React.useState('');

  const handleOnChange = (ranges) => {
    const { selection } = ranges;
    // onChange(selection);
    setSelectionRange([selection]);
    const sDate = format(selection.startDate, 'dd MMM')
    const eDate = format(selection.endDate, 'dd MMM')
    setStartEndDate({startDate:sDate,endDate:eDate})
    console.log(selection);
    // console.log(format(selection.startDate, 'dd MMMM yyyy'));
    setDiffInDays(differenceInDays(selection.endDate,selection.startDate)+1);
    setFetchLink(`http://go-dev.greedygame.com/v3/dummy/report?startDate=${format(selection.startDate, 'yyyy-MM-dd')}&endDate=${format(selection.endDate, 'yyyy-MM-dd')}`);
    console.log(fetchLink);
  };

  //toggle 
  const [toggleDatePicker, setToggleDatePicker] = React.useState(false);
  const [openSetting, setOpenSetting] = React.useState(true);
  const [dataSecondHeader, setDataSecondHeader] = React.useState({});

  //date-selection
  const [selectionRange,setSelectionRange] = React.useState([{
    startDate: subDays(new Date(), 7),
    endDate: addDays(new Date(), 1),
    key: "selection"
  }]);
  

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  //toggle to Show/Hide Column

  const [valueToRemove, setValueToRemove] = React.useState([]);

  const toggleShowColumn = (value,index) => {
    const dataSortted = [...tableDataSortted] 

    if(dataSortted.includes(value)){
      indexDispatch(tableDataSort(dataSortted.filter((item,idx)=>(item!==value))));
      console.log(dataSortted);
    }
    else{
      dataSortted.splice(index, 0, value);
      indexDispatch(tableDataSort(dataSortted));
      console.log(dataSortted);
    };
    
    if(valueToRemove.includes(value)){
    valueToRemove.splice(valueToRemove.indexOf(value),1);
    }
    else{
      setValueToRemove([...valueToRemove,value]);
    };
  }
  

  const [appName, setAppName] = React.useState();
 //fetch request

  React.useEffect(() => {
    fetch('http://go-dev.greedygame.com/v3/dummy/apps')
    .then(response=>response.json())
    .then(namedata=>
      {
        const nameList = namedata.data.map(n=>{
          return ({...n})
        }) 
        return setAppName(nameList)
      });
  }, [])

// console.log(appName);

  React.useEffect(() => {
    fetch(`${fetchLink}`)
    .then(response => response.json())
    .then(data => 
      {
        const requestArray = data.data.map(v=>{
          const request = v.requests;
          return(request)
        })
        const responseArray = data.data.map(v=>{
          const response = v.responses;
          return(response)
        })
        const impressionArray = data.data.map(v=>{
          const impression = v.impressions;
          return(impression)
        })
        const clickArray = data.data.map(v=>{
          const click = v.clicks;
          return(click)
        })
        const revenueArray = data.data.map(v=>{
          const revenue = v.revenue;
          return(revenue)
        })
        const fill_rateArray = data.data.map(v=>{
          const fill_rate = (v.requests/v.responses)*100;
          return(fill_rate)
        })
        const ctrArray = data.data.map(v=>{
          const ctr = (v.clicks/v.impressions)*100;
          return(ctr)
        })
        const apppp = data.data.map(v=>{
          let a = '';
          const ap = appName.map(n=>{
            if(v.app_id===n.app_id){
              a = n.app_name
            }
          })
          return a
        })

        // adding fill_rate and ctr to the array
        const updatedDataView = data.data.map((v,index)=>{
          const date = format(parseISO(v.date), 'dd MMMM yyyy');
          
          // const appp = appName.map(n=>{
          //   let a = '';
          //   if(v.app_id===n.app_id){
          //     a = n.app_name
          //   }
          //   return a
          // })

          const dataNum = data.data.length;
          const requestSum = requestArray.reduce((a,b)=>a+b,0);
          const responseSum = responseArray.reduce((a,b)=>a+b,0);
          const impressionSum = impressionArray.reduce((a,b)=>a+b,0);
          const clickSum = clickArray.reduce((a,b)=>a+b,0);
          const revenueSum = `$${parseFloat(revenueArray.reduce((a,b)=>a+b,0)).toFixed(2)}`;
          const fill_rateAverage = (fill_rateArray.reduce((a,b)=>a+b,0)/data.data.length).toFixed(2);
          const ctrAverage = (ctrArray.reduce((a,b)=>a+b,0)/data.data.length).toFixed(2);

          setDataSecondHeader({date:diffInDays,app_name:dataNum,requests:requestSum,responses:responseSum,impressions:impressionSum,clicks:clickSum,revenue:revenueSum,fill_rate:fill_rateAverage,ctr:ctrAverage})
          
          const revenue = `$${(v.revenue).toFixed(2)}`;
          const responses = numberWithCommas(v.responses);
          const requests = numberWithCommas(v.requests);
          const impressions = numberWithCommas(v.impressions);
          const clicks = numberWithCommas(v.clicks)
          const fill_rate = `${((v.requests/v.responses)*100).toFixed(2)}%`;
          const ctr = `${((v.clicks/v.impressions)*100).toFixed(2)}%`;
          // console.log(appp[index])
          // console.log(apppp)
          return({...v,requests:requests,clicks:clicks,impressions:impressions,responses:responses,date:date,revenue:revenue,fill_rate:fill_rate,ctr:ctr,app_name:apppp[index]})
        })
        console.log(updatedDataView)
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
          <button className='datePicker__button' onClick={()=>setToggleDatePicker(!toggleDatePicker)}><FaCalendarAlt size={15} color='rgb(61, 145, 255)'/>{startEndDate.startDate?`${startEndDate.startDate +' - '+ startEndDate.endDate}`:'date'}</button>
          <button className='datePicker__button' onClick={()=>setOpenSetting(!openSetting)}><GoSettings size={16} color='rgb(61, 145, 255)'/>settings</button>
        </div>
        <div>
          {openSetting && <div className='setting_container'>
            <div>Dimensions and Metrics</div>
            <div className='setting_sort'>
              {tableDataView?.map((item,index)=>(
                <button 
                  className='datePicker__button setting_dragButtons'
                  style={{borderLeft:!valueToRemove.includes(item.value)?'3.5px solid rgb(61, 145, 255)':''}}
                  key={index} 
                  draggable 
                  onDragStart={(e) => (dragItem.current=item.value)} 
                  onDragEnter={(e) => (dragOverItem.current=item.value)}
                  onDragEnd={handleDrag}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={()=>toggleShowColumn(item.value,index)}
                >
                  {item.header}
                </button>
              ))}
            </div>
            <div style={{display:'flex',gap:'8px',width:'100%',justifyContent:'flex-end'}}>
              <button onClick={()=>setOpenSetting(false)} className='datePicker__button' style={{color:'rgb(61, 145, 255)'}}>cancel</button>
              <button onClick={()=>setOpenSetting(false)} className='datePicker__button' style={{backgroundColor:'rgb(61, 145, 255)',color:'#fff'}}>apply changes</button>
            </div>
          </div>}
        </div>
        <Table dataSecondHeader={dataSecondHeader} valueToRemove={valueToRemove}/>
      </div>
    </div>
  );
}

export default App;

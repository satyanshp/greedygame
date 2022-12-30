import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { dateData } from '../../reducers/data';

import { HiFilter } from 'react-icons/hi';
import { BiSearch } from 'react-icons/bi';

const Table = ({dataSecondHeader,valueToRemove}) => {
  const dataView = useSelector((state)=>state.data.value);
  const tableDataView = useSelector((state)=>state.tableHead.value);
  const tableDataSort = useSelector((state)=>state.dataSort.value);
  const dispatch = useDispatch();
  // const [responseSort, setResponseSort] = React.useState()
  React.useEffect(() => {
    console.log([...dataView].sort((a,b)=>{return removeComma(a.responses) - removeComma(b.responses)}));
    
  }, [dataView])

  const removeComma = (x) => {
   return parseInt(x.replace(/\,/g,''))
  }

  const responseSortting = () => {
    const responseSort = [...dataView].sort((a,b)=>{return removeComma(a.responses) - removeComma(b.responses)})
    dispatch(dateData(responseSort))
    console.log(dateData)
  }
  const [openSearch, setOpenSearch] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState('');
  const [searchInputt, setSearchInputt] = React.useState('');
  const handleInput = () => {
    setOpenSearch(false);
    setSearchInput(searchInputt);
  }
  const handleFilter = (value) => {
    if(value==='app_name'){
      setOpenSearch(!openSearch)
    };
    if(value==='responses'){
      responseSortting();
      console.log('ll')
    }
    if(value==='clicks'){
      // responseSortting();
      console.log('ll')
    }
  }

  return (
    <div style={{marginTop:'1.5%'}}>
      {dataView.length!==0 && <table width='100%' style={{borderBottom:'0.5px solid #fff',borderCollapse: 'collapse',paddingRight:'100px'}}>
        <tr style={{height:'50px'}}>
          {tableDataView.filter(item=> !valueToRemove.includes(item.value)).map((item,index)=>(
            <th key={index} style={{textAlign: index>=2?'right':'left',position:'relative'}}>
              <div style={{cursor:'pointer'}} onClick={()=>handleFilter(item.value)}><HiFilter color='rgb(98, 97, 97)'/></div>
              <div style={{color:'rgb(98, 97, 97)',fontSize:'13px',position:'relative'}}>{item.header}</div>
              {(openSearch&&item.value==='app_name') &&
                <div style={{backgroundColor:'#fff',display:'flex',flexDirection:'column',padding:'15px 20px',gap:'20px',justifyContent:'space-between',border:'1px solid grey',borderRadius:'6px',minHeight:'100px',position:'absolute',top:'50px'}}>
                  <div style={{display:'flex',border:'1px solid grey',borderRadius:'6px',alignItems:'center',padding:'5px 8px'}}>
                    <div style={{display:'flex'}}><BiSearch/></div>
                    <input type="text" onChange={(e)=>setSearchInputt(e.target.value)} placeholder='Search' style={{border:'none',height:'100%',display:'flex',outline:'none'}}/>
                  </div>
                  <button className='datePicker__button' onClick={handleInput} style={{backgroundColor:'rgb(61, 145, 255)',color:'#fff'}}>Apply</button>
                </div>
              }
          </th>
          ))}
        </tr>
        <tr style={{borderBottom:'0.5px solid rgba(134, 134, 134, 0.593)',borderCollapse: 'collapse',height:'35px',fontSize:'18px'}}>
          {tableDataSort.map((item,index)=>(
            <td style={{textAlign: index>=2?'right':'left'}}>{dataSecondHeader[item]}</td>
          ))}
        </tr>
        {/* <tr> */}
          {dataView.filter(v =>
            {
              if(searchInput === ''){
                return v;
              }
              else if(v.app_name.toLowerCase().includes(searchInput.toLowerCase())){
                return v;
              }
            }
          ).map((item,index)=>(
            <tr key={index} style={{borderBottom:'0.5px solid rgba(134, 134, 134, 0.593)',borderCollapse: 'collapse',height:'30px'}}>
              {tableDataSort.map((itm,idx)=>
                {
                  return(
                    <td 
                    // dangerouslySetInnerHTML={{__html: item[itm]}}
                    style={{textAlign: idx>=2?'right':'left',fontSize:'13px'}}
                    >
                      {item[itm]}
                    </td>  
                  )
                }
              )}
            </tr>
          ))}
        {/* </tr> */}
      </table>}
      {dataView.length===0 && <div style={{height:'50vh', width:'100%',background:'rgba(134, 134, 134, 0.493)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontWeight:'800',fontSize:'20px'}}>
           <div>Nothing to Show !</div>
           <div style={{fontSize:'15px',fontWeight:'600'}}>Please select dates!</div>
        </div>
      }
    </div>
  )
}

export default Table
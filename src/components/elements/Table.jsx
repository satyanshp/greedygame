import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { HiFilter } from 'react-icons/hi';

const Table = () => {
  const dataView = useSelector((state)=>state.data.value);
  const tableDataView = useSelector((state)=>state.tableHead.value);
  const tableDataSort = useSelector((state)=>state.dataSort.value);
  React.useEffect(() => {
    
  }, [])
  

  return (
    <div style={{marginTop:'1.5%'}}>
      <table width='100%'>
        <tr>
          {tableDataView.map((item,index)=>(
            <th key={index}>
              <div><HiFilter/></div>
              <div>{item}</div>
          </th>
          ))}
        </tr>
        {/* <tr> */}
          {dataView?.map((item,index)=>(
            <tr key={index}>
              {tableDataSort.map((itm,idx)=>
                {
                  return(
                    <td 
                    // dangerouslySetInnerHTML={{__html: item[itm]}}
                    >
                      {item[itm]}
                    </td>  
                  )
                }
              )}
            </tr>
          ))}
        {/* </tr> */}
      </table>
    </div>
  )
}

export default Table
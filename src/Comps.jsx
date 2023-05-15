import { useState} from 'react';
import Papa from 'papaparse';
import './App.css'
import {

    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  } from "chart.js";

import { Bar } from 'react-chartjs-2';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
function Comps() {

    const [chartData, setChartData] = useState(null);
    const [csvs,setCsvs] = useState(null);
    const option={
        responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: {
            font: {
                size: 20
            }
        },
        
        },
        title: {
          display: true,
          text: "Histogram",
          font:40
        }
      }
      }
  const fetchdata=async ()=>{
    const response = await fetch('https://www.terriblytinytales.com/test.txt');
    const data = await response.text();
    // console.log(data);

    const words=data.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/)
    let filters=[]
   words.map((item)=>{
     if(!filters.includes(item))
        {
          
             filters.push(item)
        }
        return filters;
    })
     let topdata=[]

     for(let item of filters)
     {
        let flag=true
        for(let datas of words)
        {
            
           if(flag && item===datas )
           {
            topdata.push({
                label: item,
                count: 1
            }) 
            flag=false;
           }
           else if(item===datas)
           {

            topdata[filters.indexOf(item)].count+=1;
           }
        }
     }
    const blobdata=[]

    
    const finaldata=topdata.sort((a,b)=>b.count-a.count).slice(0,20)
    for(let item in finaldata)
    {
         blobdata.push([finaldata[item].label,finaldata[item].count])
    }
     console.log(blobdata)
     const csvData = Papa.unparse(blobdata, { header: true });

     const blob=new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
     const url=URL.createObjectURL(blob);
     setCsvs(url)
     setChartData({
        labels:finaldata.map((item)=> item.label),
        data:finaldata.map((item)=>{return item.count}),
        csvData:csvData
     })
     setTimeout(()=>{
console.log(chartData)
     },3000)
     
     

  }
  return (
    <div>
      {!chartData &&(<button  className='btn1' onClick={()=>{fetchdata()}}>click</button>)}
      {
        chartData &&(
            <>
<Bar className="graph" options={option} data={{labels:chartData.labels,datasets: [
            {
              label: 'Word Frequency',
              data: chartData.data,
              backgroundColor: "#FF5733",
              borderColor: '#B2BEB5',
              borderWidth: 3,
            },
          ],}} ></Bar>

          <a className='button' href={csvs} download='histogramdata.csv' >download</a>
            </>
        )
      }
    </div>
  )
}

export default Comps
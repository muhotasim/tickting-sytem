import React, { useEffect, useState } from "react";
import DataTable from "../../components/datatable";
import Select from "../../components/select";
import Checkbox from "../../components/checkbox";
import MultiCheckbox from "../../components/multi-checkbox";
import FileInput from "../../components/file-input";
import RadioGroup from "../../components/radio";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { dashboardActions } from "../../store/dashboard.store";
import ReactApexChart from "react-apexcharts";

const DashboardPage:React.FC = ()=>{
    const [file, setFile] = useState(null)
    const dispatch = useDispatch();
    const {numberOfTickets, ticket, isLoading} = useSelector((state:RootState)=>state.dashboard);
    const buildChart = ()=>{
        let series = [];
        let labels = [];
        
          for(let key of Object.keys(ticket)){
            labels.push(key);
            series.push(ticket[key]);
          }
          const chartObj = {
            series: series,
            options: {
              chart: {
                type: 'pie',
              },
              labels: labels,
            },
          };
          return chartObj;

    }
    const chartObj = buildChart()
    useEffect(()=>{
        dashboardActions.getDashboard()(dispatch);
    },[])
    return <div className='page dashboard-page animate-fade-in'>
        <h2 className="mt-15 mb-15">Dashboard</h2>
         <div className="row">
            <div className="col-md-12 col-lg-6 col-sm-12">
                <ReactApexChart options={chartObj.options} series={chartObj.series} type="pie" height={350} />
            </div>
            {/* <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col-md-6"><div className="dashboard-cart">
                  <div className="title"><h4>Average Time To Be Resolved</h4></div>
                  <div className="summery">5.6D</div>
                  </div></div>
                
              </div>
            </div> */}
         </div>
    </div>
}
export  default DashboardPage;
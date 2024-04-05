import React, { useState } from "react";
import DataTable from "../../components/datatable";
import Select from "../../components/select";
import Checkbox from "../../components/checkbox";
import MultiCheckbox from "../../components/multi-checkbox";
import FileInput from "../../components/file-input";
import RadioGroup from "../../components/radio";

const DashboardPage:React.FC = ()=>{
    const [file, setFile] = useState(null)
    return <div className='page dashboard-page animate-fade-in'>
        <h1>Header 1</h1>
        <h2>Header 2</h2>
        <h3>Header 3</h3>
        <h4>Header 4</h4>
        <h5>Header 5</h5>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
        <p className="text-bold">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
        <a href="" className="text-link">Test</a>
            <label className="form-label">Checkbox</label>
        <Checkbox label="Test" checked onChange={()=>{}}/>
            <label className="form-label">Multi Checkbox</label>
        <MultiCheckbox options={[{label: '1', value: 1},{label: '2', value: 2},{label: '3', value: 3}]} value={[2]} onChange={values=>{
            console.log(values)
        }}/>
        <div className="form-group">
            <label className="form-label">User Name</label>
        <input type="text" className="input" />
            <label className="form-label">Validation Error</label>
        <input type="text" className="input validation-error mt-5" />
        </div>
        <div>
        <Select style={{marginTop: '15px'}} value={2} options={[{label: '1', value: 1},{label: '2', value: 2},{label: '3', value: 3}]}/>
        </div>

        <div>
            <label className="form-label">File Input</label>
            {/* <input type="file" /> */}
            <FileInput value={file} onChange={(selected:any)=>setFile(selected)}/>
        </div>
        <div>
            <label className="form-label">Radio Input</label>
            {/* <input type="file" /> */}
            <RadioGroup value={2} options={[{label: '1', value: 1},{label: '2', value: 2},{label: '3', value: 3}]} onChange={(val)=>{
                console.log(val)
            }}/>
        </div>
        <div className="row mt-15 mb-15">
            <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-6"><div className="box"><p>Test 1</p></div></div>
            <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-6"><div className="box"><p>Test 2</p></div></div>
            <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-6"><div className="box"><p>Test 3</p></div></div>
            <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-6"><div className="box"><p>Test 4</p></div></div>
            <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-6"><div className="box"><p>Test 5</p></div></div>
            <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-6"><div className="box"><p>Test 6</p></div></div>
        </div>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industr</p>
    </div>
}
export  default DashboardPage;
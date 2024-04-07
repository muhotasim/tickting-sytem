import { useState } from "react"
import Select from "./select";

const FilterGrid = ({ grid = [], onFilter }: { grid: any[], onFilter: (grid: any) => void }) => {
    const gridInitialValue: any = {};
    grid.forEach(grid => {
        gridInitialValue[grid.effect_on] = '';
    })
    const [gridValues, setGridValues] = useState(gridInitialValue)

    return <form onSubmit={e=>{
        e.preventDefault();
        onFilter(gridValues);
    }}>
        <div className="filter__grid__holder">
        <div className="filter__grid">
            {grid.map((gridItem, index) => <div className="grid__item" key={index}>
                {gridItem.label?<label>{gridItem.label}</label>:null}
                <Grid options={gridItem.options} placeholder={gridItem.placeholder} value={gridValues[gridItem.effect_on]} condition={gridItem.condition} type={gridItem.type} effect_on={gridItem.effect_on} key={index} onChange={(val) => {
                    setGridValues({ ...gridValues, [gridItem.effect_on]: val })
                }} />
            </div>)}
            <div className="grid__item grid__item--filter">
                <button className="btn btn-primary btn-md" type="submit"><i className="fa fa-search"></i> Search</button>
                <button className="btn btn-primary btn-md" onClick={() => { onFilter(gridInitialValue); setGridValues(gridInitialValue) }}> <i className="fa fa-sync"></i> Reset</button>
            </div>
        </div>
    </div>
    </form>
}
const Grid = ({ condition, type, effect_on, onChange, value, placeholder, options }: {  options: any[],placeholder:string, value: any, condition: string, type: string, effect_on: string, onChange: (val: any) => void }) => {
    switch (type) {
        case "number":
            return <input className="input" placeholder={placeholder} value={value} type="number" name={effect_on} onChange={(e) => onChange(e.target.value)} />
            break;
        case "string":
            return <input className="input" placeholder={placeholder} type="text" value={value} name={effect_on} onChange={(e) => onChange(e.target.value)} />
            break;
        case "select":
            return <Select options={options.map(d=>{
                return { label: d, value: d }
            })} placeholder={placeholder} value={value} name={effect_on} onChange={(val) => onChange(val)} />
            break;
        case "date":
            break;
        default:
            return null;
    }
}
export default FilterGrid;
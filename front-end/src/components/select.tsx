import React, { useEffect, useRef, useState } from "react"

interface OptionInterface{
    label: string|number,
    value: any,
    [key:string]: any
}
interface SelectComponentInterface{
    options?: OptionInterface[],
    value?: any | any[],
    onChange?: (value:any|any[])=>void,
    allowSearch?: boolean,
    onSearch?: (option:any, searchText: string)=>boolean,
    readonly?: boolean
    disabled?: boolean
    isMulti?: boolean,
    placeHolder?: string,
    style?: any,
    noDataFoundText?: string
}
const Select:React.FC<SelectComponentInterface> = ({ noDataFoundText = '', style = {}, options, value, onSearch, onChange, allowSearch, readonly, disabled, isMulti = false, placeHolder })=>{
    const [open, setOpen] = useState(false);
    const selectRef = useRef(null)
    const [values, setValues]= useState<any[]>(isMulti?value:[value])
    const [searchText, setSearchText] = useState('')

    const removeValue = (e:React.MouseEvent<HTMLElement>, index:number)=>{
        e.stopPropagation();
        let tempValues = [...values];
        tempValues.splice(index, 1)
        setValues(tempValues);
    }
    const onSelect = (e:React.MouseEvent<HTMLElement>, option: OptionInterface)=>{
        e.preventDefault();
        e.stopPropagation();
        if(isMulti){
            let valueIndex = values.findIndex(d=>d==option.value)
            if(valueIndex!=-1){
                let tempValues = [...values];
                tempValues.splice(valueIndex, 1)
                setValues(tempValues);
               if(onChange) onChange(tempValues);

            }else{
                setValues([...values, option.value]);
                if(onChange) onChange(option.value);
            }
        }else{
            setValues([option.value]);
            if(onChange) onChange(option.value);
            setSearchText('')
            setOpen(false)
        }
    }
    useEffect(() => {
        const onSelectOpenEvent = (e: MouseEvent) => {
            const target = e.target as HTMLElement; // Cast the event target to HTMLElement
            if(selectRef.current){
                if (!target.closest(selectRef.current.target)) {
                    setOpen(false); // Close the select only if the click is outside of the select component
                }
            }
            
        };
    
        document.addEventListener('click', onSelectOpenEvent);
    
        return () => {
            document.removeEventListener('click', onSelectOpenEvent);
        };
    }, []);

    const filteredOptions = (open&&options?.length)?options&&options.filter(option=>(((allowSearch&&onSearch)?onSearch(option, searchText):true))):[]
    return <>
        <div ref={selectRef} className={"select-input "+(open?'selected':'')} style={style} onClick={(e)=>{
                e.stopPropagation();
                setOpen(true);
            }}>
            <div className="value-container">
                {isMulti&&values.map((val,index)=><span key={index} className="value">{val} <span className="remove-icon" onClick={(e)=>removeValue(e, index)}>&times;</span></span>)}<input className="search" placeholder={isMulti?placeHolder:value?value:placeHolder} onChange={e=>setSearchText(e.target.value)} value={allowSearch?searchText:isMulti?placeHolder:value}/>
                <span className="select-icon animate-fade-in"><i className={`fa ${(open&&allowSearch)?'fa-search':'fa-chevron-down'}`}></i></span>
                </div>
            {(open&&options?.length)?<div className="select-options animate-fade-in">
                <ul>
                    {filteredOptions.length?filteredOptions.map((option, index)=>{
                        return <li key={index} onClick={(e)=>{onSelect(e, option)}} className={values.includes(option.value)?'selected':''}>{option.label}</li>
                    }):<li className="text-center">{noDataFoundText?noDataFoundText:"No Options Found"}</li>}
                </ul>
            </div>:null}
        </div>
    </>
}

export default Select;
import React from 'react';
import { generateUUID } from '../utils/common.functions';
interface RadioProps {
    options: { value: any, label: string }[];
    value: any
    onChange: (val: any) => void;
}

const RadioGroup:React.FC<RadioProps> = ({options, value, onChange}:RadioProps)=>{
    const uuid = generateUUID()
    return <div className='radio__container'>
        {options.map((radio, index)=>{
            return <label className='radio' key={index}>
                <input type="radio" name={uuid} checked={value==radio.value}/>
                <span className='checkmark'></span> {radio.label}
            </label>
        })}
    </div>
}

export default RadioGroup;
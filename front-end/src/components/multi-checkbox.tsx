import React, { useState } from 'react';
import Checkbox from './checkbox';
interface MultiCheckboxProps {
    options: { value: any, label: string }[];
    value: any[]
    onChange: (val: any[]) => void;
}

const MultiCheckbox: React.FC<MultiCheckboxProps> = ({ options = [], value = [], onChange }: MultiCheckboxProps) => {
    return (
        <><div className="multi-checkbox-container">
            {options.map((option, index) => (<div key={index} className="multi-checkbox-item">
                <Checkbox key={index} label={option.label} checked={value.includes(option.value)} onChange={(v) => {
                    let tempValues = [...value]
                    let indexOfRole = tempValues.findIndex(r => r == option.value);
                    if (indexOfRole != -1) {
                        tempValues.splice(indexOfRole, 1)
                    } else {
                        tempValues.push(option.value)
                    }
                    onChange(tempValues);
                }} />
            </div>))}</div></>
    );
};

export default MultiCheckbox;

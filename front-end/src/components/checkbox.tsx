import React from 'react';
interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (val:boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }:CheckboxProps) => {
  return (
    <div className="checkbox" onClick={()=>{onChange(!checked)}}>
       <input type="checkbox" checked={checked} onChange={()=>{}}/>
        <span className="checkmark"></span> {label}
    </div>
  );
};

export default Checkbox;

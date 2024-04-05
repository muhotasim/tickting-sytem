import { useEffect, useRef, useState } from "react";

interface FileInputInterface{
    value: File|null|string;
    onChange:(file:File|null|string)=>void
}
const FileInput:React.FC<FileInputInterface> = ({value, onChange}:FileInputInterface)=>{
    const fileInputRef = useRef(null)
    const [fileName, setFileName] = useState<string>('');


    useEffect(()=>{
        
        if(value!=null && value instanceof File){
            setFileName(value.name)
        }else if(value!='' && typeof(value) == 'string'){
            setFileName(value)
        }else{
            setFileName('')
        }
        
    },[value])

    return <div className="file-input">
    <input type="file" ref={fileInputRef} style={{display: 'none'}}  onChange={(e)=>{
        const files = e.target.files;
        if(files?.length && files[0]){
            onChange(files[0])
        }else{
            return;
        }
    }}/>
    <input type="text" className="input" value={fileName} readOnly/>
    <button className="upload btn btn-md" onClick={(e)=>{ 
        e.preventDefault()
        if(fileInputRef.current) fileInputRef.current.click()
     }}><i className="fa fa-upload"></i> Upload</button>
    {value&&<button className="clear btn btn-md btn-default" onClick={(e)=>{
        e.preventDefault()
        onChange(null)
    }}><i className="fa fa-times"></i></button>}
</div>
}

export default FileInput;
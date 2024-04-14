import React, { useEffect, useState } from "react";
import Select from "../../components/select";
import { ticketPriorityOptions, ticketStatusOptions } from "../../utils/contome.datatype";
import FileInput from "../../components/file-input";
import { ticketsActions } from "../../store/tickets.store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store";


const ModifyTicket = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const {isLoading} = useSelector((state: RootState)=>state.tickets)
    const [formData, setFormData] = useState<{title: string, details: string,priority:null|string,attachments:any[] }>({
        title: '',
        details: '',
        priority: null,
        attachments: []
    })

    const addAttachment = (file:File)=>{
        let tempAttachments:any[] = [...formData.attachments]
        tempAttachments.push(file)
        setFormData({...formData, attachments: tempAttachments})
    }
    const changeAttachment = (index: number, file: any)=>{
        let tempAttachments:any[] = [...formData.attachments]
        tempAttachments[index] = file;
        setFormData({...formData, attachments: tempAttachments})
    }
    const removeAttachment = (index:number)=>{
        let tempAttachments:any[] = [...formData.attachments]
        tempAttachments.splice(index, 1)
        setFormData({...formData, attachments: tempAttachments})
    }
    const changeFormData = (key: string, value: any) => {
        setFormData({ ...formData, [key]: value })
    }
    const onSearchPriority = (option: any, text: string) => {
        return option.value.toString().toLowerCase().includes(text.toLowerCase())
    }

    const fetchData = async () => {

    }
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);
        const saved = await ticketsActions.create({
            title: formData.title,
            details: formData.details,
            priority: formData.priority,
        })(dispatch);
        if(saved){
            navigate('/tickets-management/tickets')
        }
        
        
    }

    useEffect(() => {
        fetchData();
    }, [])
    return <div className='page dashboard-page animate-fade-in'>
        <h2 className="mt-15 mb-15"> Submit Ticket</h2>
        <form onSubmit={onSubmit}>
            <div className="row">
                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <div className="form-group mt-15">
                        <label className="form-label pb-5">Title</label>
                        <input className={"input"} value={formData.title} onChange={e => changeFormData('title', e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                    <div className="form-group mt-15">
                        <label className="form-label pb-5">Priority</label>
                        <Select value={formData.priority} allowSearch onSearch={onSearchPriority} options={ticketPriorityOptions} onChange={(v) => { changeFormData('priority', v) }} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div className="form-group mt-15">
                        <label className="form-label pb-5">Description</label>
                        <textarea className="input" rows={6} value={formData.details} onChange={e => changeFormData('details', e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div className="form-group mt-15">
                        <label className="form-label pb-5">Attachments </label>
                        <FileInput value={null} onChange={(file)=>{
                            addAttachment(file)
                        }}/>
                        <p className="clearfix"></p>
                        <div className="mt-15">
                        {formData.attachments.map((attachent, index)=>{
                            return <div className="mt-15 flex" style={{gap: '1rem'}}>
                               <div><p><strong>File: </strong>{attachent?.name ?? ('File '+(index+1))}</p></div> <button className="btn btn-sm btn-primary"><i className="fa fa-trash" onClick={e=>{
                                e.preventDefault()
                                removeAttachment(index)}}></i></button>
                            </div>
                        })}
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <button type="submit" disabled={isLoading} className="btn btn-primary btn-md mt-20 mb-15 float-right">{isLoading?<i className="fa fa-sync fa-spin"></i>:<i className="fa fa-save"></i>} Submit</button>
                </div>
            </div>
        </form>
    </div>
}

export default ModifyTicket;
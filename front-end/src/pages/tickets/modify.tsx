import React, { useEffect, useState } from "react";
import Select from "../../components/select";
import { ticketPriorityOptions, ticketStatusOptions } from "../../utils/contome.datatype";


const ModifyTicket = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: null
    })

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
                        <label className="form-label pb-15">Title</label>
                        <input className={"input"} value={formData.title} onChange={e => changeFormData('title', e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                    <div className="form-group mt-15">
                        <label className="form-label pb-15">Priority</label>
                        <Select value={formData.priority} allowSearch onSearch={onSearchPriority} options={ticketPriorityOptions} onChange={(v) => { changeFormData('priority', v) }} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div className="form-group mt-15">
                        <label className="form-label pb-15">Description</label>
                        <textarea className="input" rows={6} value={formData.description} onChange={e => changeFormData('description', e.target.value)} />
                    </div>
                </div>
            </div>

        </form>
    </div>
}

export default ModifyTicket;
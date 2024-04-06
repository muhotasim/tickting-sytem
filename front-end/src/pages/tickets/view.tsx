import React, { useEffect, useState } from "react";
import Select from "../../components/select";
import { ResponseType, ticketPriorityOptions, ticketStatusOptions } from "../../utils/contome.datatype";
import FileInput from "../../components/file-input";
import { ticketsActions } from "../../store/tickets.store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../store";
import { TicketApiService } from "../../services/tickets-api.service";
import appConst from "../../constants/app.const";


const ViewTicket = () => {
    const { id } = useParams()
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { isLoading } = useSelector((state: RootState) => state.tickets)
    const [ticketData, setTicketData] = useState({
        priority: '',
        details: '',
        rating: 0,
        resolved_date: null,
        status: '',
        submission_date: null,
        title: ''
    })

    const fetchData = async () => {
        const apiHandler = new TicketApiService(appConst.API_URL);
        const ticketId = Number(id);
        const response = await apiHandler.getById(ticketId);
        if (response.type == ResponseType.success) {
            setTicketData({
                priority: response.data.priority,
                details: response.data.details,
                rating: response.data.rating,
                resolved_date: response.data.resolved_date,
                status: response.data.status,
                submission_date: response.data.submission_date,
                title: response.data.title
            })
            const commentsResponse = await apiHandler.comments(ticketId);
            if (commentsResponse.type == ResponseType.success) {
                console.log(commentsResponse)
                debugger
            }
        }
    }


    useEffect(() => {
        fetchData();
    }, [])
    return <div className='page dashboard-page animate-fade-in'>
        <h2 className="mt-15 mb-15">Ticket {id} </h2>

        <div className="ticket-details">
            <div className="row">
                <div className="col-md-6">
                    <span className="btn btn-primary btn-lg float-right mb-15" style={{ fontSize: '16px' }}>{ticketData.priority}</span>

                    <p className="clearfix"></p>
                    <h4 className="mb-15">{ticketData.title}</h4>
                    <p>{ticketData.details}</p>
                </div>
            </div>
        </div>
    </div>
}

export default ViewTicket;
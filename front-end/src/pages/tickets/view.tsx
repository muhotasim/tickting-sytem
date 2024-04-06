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
import moment from "moment";


const ViewTicket = () => {
    const { id } = useParams()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [commentText, setCommentText] = useState('')
    const { isLoading } = useSelector((state: RootState) => state.tickets)
    const [comments, setComments] = useState([
        {
            "id": 1,
            "comment": "test",
            "created_at": null,
            "updated_at": "2024-04-06T14:16:22.834Z",
            "comments": [{
                "id": 2,
                "comment": "test 2",
                "created_at": null,
                "updated_at": "2024-04-06T14:16:31.877Z"
            }]
        },

    ])
    const [ticketData, setTicketData] = useState({
        priority: '',
        details: '',
        rating: 0,
        resolved_date: null,
        status: '',
        submission_date: null,
        title: ''
    })

    const makeComment = async () => {

        const apiHandler = new TicketApiService(appConst.API_URL);
        const responseCommentResponse = await apiHandler.makeComment({ ticket_id: Number(id), comment: commentText })
        if (responseCommentResponse.type == ResponseType.success) {
            setCommentText('');
            const commentsResponse = await apiHandler.comments(Number(id));
            if (commentsResponse.type == ResponseType.success) {
                console.log(commentsResponse)
                setComments(commentsResponse.data);
            }
        }
    }
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
                setComments(commentsResponse.data);
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

            <div >
                <h5 className="mt-15">Comments</h5>
                <div className="row">
                    <div className="col-md-6">
                        <textarea className="input" value={commentText} onChange={e => setCommentText(e.target.value)}></textarea>
                        <button className="btn btn-md btn-primary float-right" onClick={makeComment}> Comment</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <ul className="comments-holder">
                            {comments.map((comment:any, index) => {
                                return <li className="comment" key={index}>
                                    <p className="user-name">{comment.user.name}</p>
                                    <p className="text-small mb-5 date-text">{moment(comment.created_at).format('LLLL')}</p>
                                    <p className="comment-text">{comment.comment}</p>

                                    <ul className="sub-comment-holder">
                                        {comment.comments.map((childComment:any, indexChild:number) => {
                                            return <li className="comment" key={index + '-' + indexChild}>
                                                <p className="user-name">{childComment.user.name}</p>
                                                <p className="text-small mb-5 date-text">{moment(childComment.created_at).format('LLLL')}</p>
                                                <p className="comment-text">{childComment.comment}</p>
                                            </li>
                                        })}
                                    </ul>

                                </li>
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default ViewTicket;
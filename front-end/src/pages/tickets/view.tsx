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
import Loader from "../../components/loading";


const ViewTicket = () => {
    const { id } = useParams()
    const dispatch = useDispatch();
    const [commentText, setCommentText] = useState('')
    const {isLoading, title, details, priority, status,submission_date, comments, isCommentLoading, assigned_to} = useSelector((state: RootState) => state.tickets.ticketDetails)
    const user =  useSelector((state: RootState) => state.auth.user)

    const markAsResolved = async () => {
        const apiHandler = new TicketApiService(appConst.API_URL);
        const resolveResponse = await apiHandler.resolveTicket(Number(id))
        if (resolveResponse.type == ResponseType.success) {
            ticketsActions.ticketDetails(Number(id))(dispatch)
        }
    }

    const makeComment = async () => {
        const apiHandler = new TicketApiService(appConst.API_URL);
        const responseCommentResponse = await apiHandler.makeComment({ ticket_id: Number(id), comment: commentText, parent_id: undefined })
        if (responseCommentResponse.type == ResponseType.success) {
            setCommentText('');
            ticketsActions.getComments(Number(id))(dispatch)
        }
    }
    const makeChildComment = async (parentId: number, comment: string) => {
        const apiHandler = new TicketApiService(appConst.API_URL);
        const responseCommentResponse = await apiHandler.makeComment({ ticket_id: Number(id), comment: comment, parent_id: parentId })
        if (responseCommentResponse.type == ResponseType.success) {
            ticketsActions.getComments(Number(id))(dispatch)
        }
    }

    const takeControl =async ()=>{
        const apiHandler = new TicketApiService(appConst.API_URL);
        const response = await apiHandler.takeControl({ticket_id: Number(id), user_id: Number(user.id)})
        if (response.type == ResponseType.success) {
            ticketsActions.ticketDetails(Number(id))(dispatch)
        }
    }

    useEffect(() => {
        ticketsActions.ticketDetails(Number(id))(dispatch)

        window.scrollTo({top: 0})
    }, [id])

    return <div className='page dashboard-page animate-fade-in'>
        {isLoading&&<p className="text-center"><i className="fa fa-sync fa-spin"></i> please wait</p>}
        <div style={{opacity:isLoading?0:1}}>
        <div className="row">
            <div className="col-md-6">
                <h2 className="mt-15 mb-15">Ticket #{id} <span className="btn mb-15 float-right" style={{ fontSize: '16px' }}>{status}</span></h2>
            </div> </div>
        <div className="ticket-details">
            <div className="row">
                <div className="col-md-6">
                    <p className="clearfix"></p>
                    <h4 className="mb-15">{title}</h4>
                    <div className="mb-20 pb-20">
                    <span className="btn mb-15 mt-15" style={{ fontSize: '16px' }}>{priority}</span>
                    <div>
                    {(status!='Resolved')&&<button className="btn btn-sm btn-primary float-right ml-5 mb-5" style={{ fontSize: '16px' }} onClick={() => { markAsResolved() }}>Resolve</button>}
                    {(status=='Open'&&!assigned_to)&&<button className="btn btn-sm float-right btn-primary" style={{ fontSize: '16px' }} onClick={()=>{takeControl()}}>Take Control</button>}
                    </div>
                    
                    <p className="clearfix"></p>
                    </div>
                    <p className="clearfix"></p>
                    <p>{details} </p>
                </div>
            </div>
            {isCommentLoading?<p className="text-center"><i className="fa fa-sync fa-spin"></i> please wait</p>:<div >
                <h5 className="mt-15">Comments</h5>
                <div className="row">
                    <div className="col-md-6">
                        <ul className="comments-holder">
                            {comments.map((comment: any, index) => {
                                return <Comment status={status} key={index} comment={comment} makeChildComment={makeChildComment} />
                            })}
                        </ul>
                    </div>
                </div>
                {status!='Resolved'&&<div className="row">
                    <div className="col-md-6">
                        <textarea className="input" value={commentText} onChange={e => setCommentText(e.target.value)}></textarea>
                        <button className="btn btn-md btn-primary float-right mt-10" onClick={makeComment}> Comment</button>
                    </div>
                </div>}
            </div>}
        </div>
        </div>
    </div>
}

const Comment = ({ comment, makeChildComment, status }: any) => {
    const [reply, setReply] = useState(false);
    const [commentText, setCommentText] = useState('');
    const toggleReply = () => {
        console.log(!reply)
        setReply(!reply)
    }
    return <li className="comment">
        <p className="user-name">{comment?.user?.name ?? ''}</p>
        <p className="text-small mb-5 date-text">{moment(comment.created_at).format('LLLL')}</p>
        <p className="comment-text">{comment.comment}</p>
        {status!='Resolved'&&<p className="text-link mb-5 float-right" style={{ cursor: 'pointer' }} onClick={toggleReply}>reply</p>}

        {comment.comments.length > 0 ? <ul className="sub-comment-holder ml-20 mt-15">
            {comment.comments.map((childComment: any, indexChild: number) => {
                return <li className="comment" key={indexChild}>
                    <p className="user-name">{childComment?.user?.name ?? ''}</p>
                    <p className="text-small mb-5 date-text">{moment(childComment.created_at).format('LLLL')}</p>
                    <p className="comment-text">{childComment.comment}</p>
                </li>
            })}
        </ul> : null}
        {reply ? <div>
            <div className="mb-15">
                <textarea className="input" value={commentText} onChange={e => setCommentText(e.target.value)}></textarea>
                <button className="btn btn-md btn-primary float-right mt-10" onClick={async () => {
                    await makeChildComment(comment.id, commentText)
                    setCommentText('')
                    setReply(false)
                }}> Comment</button>
                <p className="clearfix"></p>
            </div>
        </div> : null}

    </li>
}

export default ViewTicket;
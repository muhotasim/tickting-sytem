export enum JobTypes { mail = 'mail' }
export interface JobData { 
    jobType: JobTypes;
    data: { [key:string]:any}
}
export enum ResponseType { success = 'success', error = 'error', validate = 'validate', unauthorize = 'unauthorize' }
export interface ResponseInterface{
    type: ResponseType;
    message: '',
    data: {[key:string]: any},
    validation: any[]
}

export enum NotificationStatus {
    read = 'read',
    unread = 'unread',
    dismissed = 'dismissed'
}

export enum NotificationType {
    email = 'email',
    sms = 'sms',
    app = 'app'
}

export interface NotificationInterface<User>{ type: NotificationType, status: NotificationStatus, message: string, link: string, user:User  }

export enum GridTypes{
    number = 'number',
    string = 'string',
    date = 'date',
    select = 'select'
}

export enum TicketPriority{
    low = 'Low',
    medium = 'Medium',
    high = 'High',
    critical = 'Critical',
}
export enum TicketStatus{
    open = 'Open',
    inprocess = 'In Progress',
    waitingforcustomer = 'Waiting for Customer',
    resolved = 'Resolved',
    reopened = 'Reopened',
    cancelled = 'Cancelled',
}
export interface TicketInterface {
    title: string;
    details: string;
    priority: TicketPriority;
    status: TicketStatus;
    submission_date: Date|string;
    submited_by: number;

}
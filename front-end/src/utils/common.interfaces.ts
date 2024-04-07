export interface PermissionInterface {
    permission_key: string;
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

export enum TicketPriority{
    low = 'Low',
    medium = 'Medium',
    high = 'High',
    critical = 'Critical',
}
export enum TicketStatus{
    open = 'Open',
    assigned = 'Assigned',
    inprocess = 'In Progress',
    onhold = 'On Hold',
    waitingforcustomer = 'Waiting for Customer',
    resolved = 'Resolved',
    reopened = 'reopened',
    cancelled = 'Cancelled',
}
export interface NotificationInterface<User>{ type: NotificationType, status: NotificationStatus, message: string, link: string, user:User  }
export interface TicketInterface{
        priotity: TicketPriority,
        status: TicketStatus,
        title: string,
        details: string
        rating: number
      }
export interface AuthStateInterface {
    user: {
        id: null|number;
        token: string | null;
        refetshToken: string | null;
        name: string;
        email: string;
        permissions: PermissionInterface[];
        isSuperadmin: boolean;
    },
    loggedIn: boolean;
    isLoading: boolean;
    error: any;
    passwordResetSuccess: boolean;
    forgotPasswordMailSend: boolean;
    changePasswordSuccess: boolean;
    appLoading: boolean;
    notifications: NotificationInterface<any>[]
}
export interface NotificationStateInterface {
    perPage: number;
    page: number;
    notifications: NotificationInterface<number>[];
    total: number;
    
    isLoading: boolean;
    error: any;
    grid: any[];
    gridFilters: {[key:string]: any}
}
export interface TicketStateInterface {
    perPage: number;
    page: number;
    tickets: TicketInterface[];
    total: number;
    isLoading: boolean;
    error: any;
    grid: any[];
    gridFilters: {[key:string]: any},
    ticketDetails: TicketDetails
}
export interface TicketDetails {
    priority: string,
    details: string,
    rating: number,
    resolved_date: null|Date|string,
    status: string,
    submission_date: null|Date|string,
    title: string,
    comments: any[],
    isLoading: boolean
    isCommentLoading: boolean
}
export interface UsersStateInterface {
    perPage: number;
    page: number;
    users: any[];
    total: number;
    
    isLoading: boolean;
    error: any;
    grid: any[];
    gridFilters: {[key:string]: any}
}
export interface RolesStateInterface {
    perPage: number;
    page: number;
    roles: any[];
    rolesAll: {id:number, name:string}[];
    total: number;
    
    isLoading: boolean;
    error: any;
    grid: any[];
    gridFilters: {[key:string]: any}
}
export interface PermissionStateInterface {
    perPage: number;
    page: number;
    permissions: any[];
    permissionAll: {id:number, name:string}[];
    total: number;
    
    isLoading: boolean;
    error: any;
    grid: any[];
    gridFilters: {[key:string]: any}
}
export interface UiStateInterface {
    theme: string
    themeList: string[]
}

export interface QueryParams {
    [key:string]: any
}
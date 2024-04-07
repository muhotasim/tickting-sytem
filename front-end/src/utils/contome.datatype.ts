
export enum ResponseType { success = 'success', error = 'error', validate = 'validate', unauthorize = 'unauthorize' }

export const ticketStatusOptions = [
    {label: 'Open', value: 'Open'},
    {label: 'In Progress', value: 'In Progress'},
    {label: 'Waiting for Customer', value: 'Waiting for Customer'},
    {label: 'Resolved', value: 'Resolved'},
    {label: 'Reopened', value: 'Reopened'},
    {label: 'Cancelled', value: 'Cancelled'},
];
export const ticketPriorityOptions = [
    {label: 'Low', value: 'Low'},
    {label: 'Medium', value: 'Medium'},
    {label: 'High', value: 'High'},
    {label: 'Critical', value: 'Critical'},

];

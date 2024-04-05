import { MenuItem } from "../components/sidebar";

export const sidebarConst:MenuItem[] = [
    { 
        label: 'Dashboard',
        link: '/',
        childrens: [],
        permissionKey: 'can-see-dashboard',
        iconClass: 'fa fa-gauge-high'
    },
    { 
        label: 'Ticket Management',
        link: '/tickets-management',
        permissionKey: 'can-control-access',
        iconClass: 'fa fa-list',
        childrens: [
            { 
                label: 'Tickets',
                link: '/tickets-management/tickets',
                childrens: [],
                permissionKey: 'can-get-users-with-count',
                iconClass: 'fa fa-clipboard-list'
            },
            { 
                label: 'Submit Ticket',
                link: '/tickets-management/submit',
                childrens: [],
                permissionKey: 'can-get-users-with-count',
                iconClass: 'fa fa-square-plus'
            },
        ]
    },
    { 
        label: 'Access Management',
        link: '/access-management',
        permissionKey: 'can-control-access',
        iconClass: 'fa fa-users-gear',
        childrens: [
            { 
                label: 'User',
                link: '/access-management/users',
                childrens: [],
                permissionKey: 'can-get-users-with-count',
                iconClass: 'fa fa-user-group'
            },
            { 
                label: 'Roles',
                link: '/access-management/roles',
                childrens: [],
                permissionKey: 'can-get-roles-with-count',
                iconClass: 'fa fa-users'
            },
            { 
                label: 'Permissions',
                link: '/access-management/permissions',
                permissionKey: 'can-get-permission-with-count',
                childrens: [],
                iconClass: 'fa fa-key',  
            },
        ]
    }
];

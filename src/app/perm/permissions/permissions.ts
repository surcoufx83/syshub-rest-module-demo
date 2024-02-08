const ACCESS_BACKUPRESTORE = 'ACCESS_BACKUPRESTORE';
const ACCESS_CONSOLE = 'ACCESS_CONSOLE';
const ACCESS_CUSTOM = 'ACCESS_CUSTOM';
const ACCESS_IMPORTMANAGEMENT = 'ACCESS_IMPORTMANAGEMENT';
const ACCESS_PACKAGEMANAGEMENT = 'ACCESS_PACKAGEMANAGEMENT';
const ACCESS_REPORTING = 'ACCESS_REPORTING';
const ACCESS_SECUREDHTTP = 'ACCESS_SECUREDHTTP';
const ACCESS_SYSLOG = 'ACCESS_SYSLOG';
const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
const CONFIG_SERVER = 'CONFIG_SERVER';
const CONFIG_SERVER_ALL = 'CONFIG_SERVER_ALL';
const CONFIG_SERVER_PSETS = 'CONFIG_SERVER_PSETS';
const GENERAL_SERVER_ACCESS = 'GENERAL_SERVER_ACCESS';
const MODIFY_JOBS = 'MODIFY_JOBS';
const SERVER_ALL = 'SERVER_ALL';
const USER_MANAGEMENT = 'USER_MANAGEMENT';
const VIEW_JOBLOG = 'VIEW_JOBLOG';
const VIEW_JOBS = 'VIEW_JOBS';
const WORKFLOW_DESIGN = 'WORKFLOW_DESIGN';
const WORKFLOW_MGM = 'WORKFLOW_MGM';

const ROLE_ADMIN = 'ROLE_ADMIN';
const ROLE_AGENT = 'ROLE_AGENT';
const ROLE_APPLIC = 'ROLE_APPLIC';
const ROLE_OPERATOR = 'ROLE_OPERATOR';
const ROLE_REPORT = 'ROLE_REPORT';
const ROLE_SERVICE = 'ROLE_SERVICE';
const ROLE_WEBUI = 'ROLE_WEBUI';

export interface PermissionsItem {
    title: string;
    permissionsets: string[];
    roles: string[];
}

const CommonSet1 = {
    permissionsets: [
        ACCESS_BACKUPRESTORE,
        ACCESS_IMPORTMANAGEMENT,
        ACCESS_PACKAGEMANAGEMENT,
        CONFIG_SERVER,
        GENERAL_SERVER_ACCESS,
        SERVER_ALL,
        WORKFLOW_DESIGN,
        WORKFLOW_MGM,
    ],
    roles: [
        ROLE_ADMIN,
        ROLE_APPLIC,
        ROLE_OPERATOR,
        ROLE_SERVICE,
    ]
};

const CommonBackupSet = {
    permissionsets: [
        ACCESS_BACKUPRESTORE,
        ACCESS_IMPORTMANAGEMENT,
        ACCESS_PACKAGEMANAGEMENT,
        GENERAL_SERVER_ACCESS,
        SERVER_ALL,
    ],
    roles: [
        ROLE_ADMIN,
        ROLE_APPLIC,
        ROLE_OPERATOR,
        ROLE_SERVICE,
    ]
};

export const permissions: { [key: string]: PermissionsItem } = {
    PERM_IADMINSERVICE_GETLIST: {
        title: 'PERM_IADMINSERVICE_GETLIST',
        permissionsets: [
            ACCESS_BACKUPRESTORE,
            ACCESS_IMPORTMANAGEMENT,
            ACCESS_PACKAGEMANAGEMENT,
            ACCESS_SYSLOG,
            CONFIG_SERVER,
            MODIFY_JOBS,
            SERVER_ALL,
            USER_MANAGEMENT,
            WORKFLOW_DESIGN,
            WORKFLOW_MGM,
        ],
        roles: [
            ROLE_ADMIN,
            ROLE_APPLIC,
            ROLE_OPERATOR,
            ROLE_SERVICE,
        ]
    },
    PERM_IADMINSERVICE_GETOBJECT: {
        title: 'PERM_IADMINSERVICE_GETOBJECT',
        permissionsets: [
            ACCESS_BACKUPRESTORE,
            ACCESS_IMPORTMANAGEMENT,
            ACCESS_PACKAGEMANAGEMENT,
            ACCESS_SYSLOG,
            CONFIG_SERVER,
            SERVER_ALL,
            WORKFLOW_DESIGN,
            WORKFLOW_MGM,
        ],
        roles: [
            ROLE_ADMIN,
            ROLE_APPLIC,
            ROLE_OPERATOR,
            ROLE_SERVICE,
        ]
    },
    PERM_IADMINSERVICE_GETSERVERINFOS: {
        title: 'PERM_IADMINSERVICE_GETSERVERINFOS',
        permissionsets: [
            ACCESS_BACKUPRESTORE,
            ACCESS_IMPORTMANAGEMENT,
            ACCESS_PACKAGEMANAGEMENT,
            CONFIG_SERVER,
            SERVER_ALL,
            WORKFLOW_DESIGN,
            WORKFLOW_MGM,
        ],
        roles: [
            ROLE_ADMIN,
            ROLE_APPLIC,
            ROLE_SERVICE,
        ]
    },
    PERM_IADMINSERVICE_GETUSERDATABYNAME: {
        title: 'PERM_IADMINSERVICE_GETUSERDATABYNAME',
        permissionsets: CommonSet1.permissionsets,
        roles: CommonSet1.roles,
    },
    PERM_IADMINSERVICE_GETWORKFLOWITEM: {
        title: 'PERM_IADMINSERVICE_GETWORKFLOWITEM',
        permissionsets: CommonSet1.permissionsets,
        roles: CommonSet1.roles,
    },
    PERM_IEPOSSERVER_GETINFORMATIONLIST: {
        title: 'PERM_IEPOSSERVER_GETINFORMATIONLIST',
        permissionsets: [
            ACCESS_BACKUPRESTORE,
            ACCESS_IMPORTMANAGEMENT,
            ACCESS_PACKAGEMANAGEMENT,
            CONFIG_SERVER,
            GENERAL_SERVER_ACCESS,
            SERVER_ALL,
            WORKFLOW_DESIGN,
        ],
        roles: [
            ROLE_ADMIN,
            ROLE_APPLIC,
            ROLE_OPERATOR,
            ROLE_SERVICE,
        ]
    },
    'PERM_IEPOSSERVER_RESTOREDATABASE+PERM_IEPOSSERVER_EXISTSSERVERFILE': {
        title: 'PERM_IEPOSSERVER_RESTOREDATABASE und PERM_IEPOSSERVER_EXISTSSERVERFILE',
        permissionsets: CommonBackupSet.permissionsets,
        roles: CommonBackupSet.roles
    },
    PERM_IEPOSSERVER_RUNCONSOLECOMMAND: {
        title: 'PERM_IEPOSSERVER_RUNCONSOLECOMMAND',
        permissionsets: [
            ACCESS_BACKUPRESTORE,
            ACCESS_CUSTOM,
            ACCESS_IMPORTMANAGEMENT,
            ACCESS_PACKAGEMANAGEMENT,
            GENERAL_SERVER_ACCESS,
            SERVER_ALL,
        ],
        roles: [
            ROLE_ADMIN,
            ROLE_APPLIC,
            ROLE_OPERATOR,
            ROLE_SERVICE,
        ]
    },
    'PERM_IEPOSSERVER_SAVEDATABASE+PERM_IEPOSSERVER_RESTOREDATABASE': {
        title: 'PERM_IEPOSSERVER_SAVEDATABASE und PERM_IEPOSSERVER_RESTOREDATABASE',
        permissionsets: CommonBackupSet.permissionsets,
        roles: CommonBackupSet.roles
    },
    PERM_IJOBSERVICE_ADDJOB: {
        title: 'PERM_IJOBSERVICE_ADDJOB',
        permissionsets: [
            MODIFY_JOBS,
            SERVER_ALL,
            VIEW_JOBS,
        ],
        roles: [
            ROLE_ADMIN,
            ROLE_APPLIC,
            ROLE_OPERATOR,
            ROLE_SERVICE,
        ]
    },
    PERM_IJOBSERVICE_GETJOBS: {
        title: 'PERM_IJOBSERVICE_GETJOBS',
        permissionsets: [
            MODIFY_JOBS,
            SERVER_ALL,
            VIEW_JOBS,
            WORKFLOW_DESIGN,
        ],
        roles: [
            ROLE_ADMIN,
            ROLE_APPLIC,
            ROLE_OPERATOR,
            ROLE_SERVICE,
        ]
    },
};

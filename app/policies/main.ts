/*
|--------------------------------------------------------------------------
| Bouncer policies
|--------------------------------------------------------------------------
|
| You may define a collection of policies inside this file and pre-register
| them when creating a new bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

export enum Permissions {
    PROJECT_EDIT = 'project:edit',
    PROJECT_CREATE = 'project:create',
    PROJECT_DELETE = 'project:delete',
    PROJECT_READ = 'project:read',
}

export const policies = {
    ProjectPolicy: () => import('#policies/project_policy'),
}

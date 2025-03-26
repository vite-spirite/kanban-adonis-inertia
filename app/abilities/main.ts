/*
|--------------------------------------------------------------------------
| Bouncer abilities
|--------------------------------------------------------------------------
|
| You may export multiple abilities from this file and pre-register them
| when creating the Bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

import { Bouncer } from '@adonisjs/bouncer'

export enum Permissions {
    PROJECT_EDIT = 'project:edit',
    PROJECT_CREATE = 'project:create',
    PROJECT_DELETE = 'project:delete',
    PROJECT_READ = 'project:read',
}

/**
 * Delete the following ability to start from
 * scratch
 */
export const editUser = Bouncer.ability(() => {
    return true
})

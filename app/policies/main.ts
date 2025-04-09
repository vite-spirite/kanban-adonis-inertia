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

export const policies = {
    TaskPolicy: () => import('#policies/task_policy'),
    ProjectTagPolicy: () => import('#policies/project_tag_policy'),
    ProjectCategoryPolicy: () => import('#policies/project_category_policy'),
    ProjectRolePolicy: () => import('#policies/project_role_policy'),
    ProjectPolicy: () => import('#policies/project_policy'),
}

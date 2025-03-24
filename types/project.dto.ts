import type Project from '#models/project'

export type MinimalProject = Pick<Project, 'id' | 'name' | 'image'>

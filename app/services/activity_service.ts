import Activity from '#models/activity'
import { CreateActivityDto } from '#types/activity.dto'

export class ActivityService {
    findByProjectId(projectId: string): Promise<Activity[]> {
        return Activity.query()
            .where('project_id', projectId)
            .orderBy('created_at', 'desc')
            .preload('actor')
            .preload('project')
            .limit(15)
    }

    findByTaskId(taskId: string): Promise<Activity[]> {
        return Activity.query()
            .where('subject_type', 'task')
            .andWhere('subject_id', taskId)
            .orWhereRaw(`meta ->> 'task_id' = ?`, [taskId])
            .orderBy('created_at', 'desc')
            .preload('actor')
            .preload('project')
            .limit(15)
    }

    createActivity(activity: CreateActivityDto): Promise<Activity> {
        return Activity.create(activity)
    }

    createMany(activities: CreateActivityDto[]): Promise<Activity[]> {
        return Activity.createMany(activities)
    }
}

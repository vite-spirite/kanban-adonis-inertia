import type { PermissionDto } from '#types/permission.dto'

export const can = (capabilities: PermissionDto[], permission: string): boolean => {
    return !!capabilities.find((cap) => cap.name === permission && cap.allow)
}

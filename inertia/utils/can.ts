import type { PermissionDto } from '#types/permission.dto'
import { Permissions } from '~/utils/permission_enum'

export const can = (capabilities: PermissionDto[], permission: Permissions): boolean => {
    return !!capabilities.find((cap) => cap.name === permission && cap.allow)
}

export interface Group {
  id: number; // Changed from string to number to match API
  name: string;
  description: string;
  userGroups: UserGroup[]; // Added to match API structure
  teamLeaderId?: string; // Made optional since API doesn't include this
  memberCount?: number; // Made optional, will be calculated from userGroups
  createdAt?: Date; // Made optional since API doesn't include this
}

export interface UserGroup {
  userId: string;
  groupId: number;
  role: 'teamleader' | 'admin' | 'member';
  joinedAt?: Date;
}

export interface GroupMember {
  userId: string;
  name: string;
  email: string;
  role: 'teamleader' | 'admin' | 'member';
  joinedAt: Date;
}

export interface CreateGroupRequest {
  name: string;
  description: string;
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
}

export enum UserRole {
  TEAMLEADER = 'teamleader',
  ADMIN = 'admin',
  MEMBER = 'member'
}

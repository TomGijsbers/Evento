import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group, GroupMember, CreateGroupRequest, UpdateGroupRequest } from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = 'https://localhost:7100/api';

  constructor(private http: HttpClient) {}

  // Get all groups
  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/Group`);
  }

  // Create group
  createGroup(request: CreateGroupRequest): Observable<Group> {
    return this.http.post<Group>(`${this.apiUrl}/Group`, request);
  }

  // Get group by ID
  getGroup(id: string): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/Group/${id}`);
  }

  // Update group
  updateGroup(id: string, request: UpdateGroupRequest): Observable<Group> {
    return this.http.put<Group>(`${this.apiUrl}/Group/${id}`, request);
  }

  // Delete group
  deleteGroup(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Group/${id}`);
  }

  // Get group members
  getGroupMembers(groupId: string): Observable<GroupMember[]> {
    return this.http.get<GroupMember[]>(`${this.apiUrl}/Group/${groupId}/members`);
  }

  // Add member to group
  addMember(groupId: string, userId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/Group/${groupId}/members/${userId}`, {});
  }

  // Remove member from group
  removeMember(groupId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Group/${groupId}/members/${userId}`);
  }

  // Leave group
  leaveGroup(groupId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Group/${groupId}/members/me`);
  }

  // Set admin status
  setAdminStatus(groupId: string, userId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/Group/${groupId}/members/${userId}/admin`, {});
  }

  // Get user's groups
  getUserGroups(userId: string): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/Group/user/${userId}`);
  }
}

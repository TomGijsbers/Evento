import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupService } from '../services/group.service';
import { Group, UserRole } from '../models/group.model';
import { GroupCardComponent } from './components/group-card/group-card.component';
import { CreateGroupComponent } from './components/create-group/create-group.component';
import { GroupMembersComponent } from './components/group-members/group-members.component';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [CommonModule, GroupCardComponent, CreateGroupComponent, GroupMembersComponent],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css'
})
export class GroupComponent implements OnInit {
  groups: Group[] = [];
  selectedGroupId: string | null = null;
  showCreateGroup = false;
  showMembers = false;
  currentUserRole: UserRole = UserRole.MEMBER;
  currentUserId = 'current-user-id'; // This should come from auth service
  isLoading = false;

  constructor(private groupService: GroupService) {}

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.isLoading = true;
    // Load all groups since the API returns all groups
    this.groupService.getGroups().subscribe({
      next: (groups) => {
        // Transform the data to add missing properties
        this.groups = groups.map(group => ({
          ...group,
          memberCount: group.userGroups?.length || 0,
          teamLeaderId: this.getTeamLeaderId(group),
          createdAt: new Date() // Placeholder since API doesn't provide this
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading groups:', error);
        this.isLoading = false;
      }
    });
  }

  private getTeamLeaderId(group: Group): string {
    // Find the teamleader from userGroups
    const teamLeader = group.userGroups?.find(ug => ug.role === 'teamleader');
    return teamLeader?.userId || '';
  }

  onViewGroup(groupId: string): void {
    this.selectedGroupId = groupId;
    this.showMembers = true;
  }

  onEditGroup(groupId: string): void {
    // Implement edit functionality
    console.log('Edit group:', groupId);
  }

  onDeleteGroup(groupId: string): void {
    if (confirm('Weet je zeker dat je deze groep wilt verwijderen?')) {
      this.groupService.deleteGroup(groupId).subscribe({
        next: () => this.loadGroups(),
        error: (error) => console.error('Error deleting group:', error)
      });
    }
  }

  onLeaveGroup(groupId: string): void {
    if (confirm('Weet je zeker dat je deze groep wilt verlaten?')) {
      this.groupService.leaveGroup(groupId).subscribe({
        next: () => this.loadGroups(),
        error: (error) => console.error('Error leaving group:', error)
      });
    }
  }

  onCreateGroup(): void {
    this.showCreateGroup = true;
  }

  onGroupCreated(): void {
    this.showCreateGroup = false;
    this.loadGroups();
  }

  onCancelCreate(): void {
    this.showCreateGroup = false;
  }

  closeMembersView(): void {
    this.showMembers = false;
    this.selectedGroupId = null;
  }

  isTeamLeader(group: Group): boolean {
    return group.teamLeaderId === this.currentUserId;
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../../services/group.service';
import { GroupMember, UserRole } from '../../../models/group.model';

@Component({
  selector: 'app-group-members',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white border-4 border-black">
      <div class="bg-yellow-400 p-4">
        <h3 class="text-xl font-bold text-black uppercase tracking-wide">GROEPSLEDEN</h3>
      </div>
      <div class="p-6">
        <!-- Add Member Section -->
        <div *ngIf="canManageMembers" class="mb-6 p-4 bg-gray-100 border-2 border-black">
          <h4 class="font-bold text-black mb-3 uppercase">LID TOEVOEGEN</h4>
          <div class="flex gap-2">
            <input 
              type="text" 
              [(ngModel)]="newMemberEmail"
              placeholder="E-mailadres"
              class="flex-1 px-3 py-2 border-2 border-black focus:border-blue-500 focus:outline-none font-medium">
            <button 
              (click)="addMember()"
              [disabled]="!newMemberEmail || isLoading"
              class="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 font-bold border-2 border-black transition-colors">
              TOEVOEGEN
            </button>
          </div>
        </div>

        <!-- Members List -->
        <div class="space-y-3">
          <div *ngFor="let member of members" 
               class="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-300">
            <div class="flex-1">
              <h5 class="font-bold text-black">{{ member.name }}</h5>
              <p class="text-gray-600 font-medium">{{ member.email }}</p>
              <div class="flex items-center gap-2 mt-1">
                <span [ngClass]="getRoleBadgeClass(member.role)" class="px-2 py-1 text-xs font-bold">
                  {{ getRoleLabel(member.role) }}
                </span>
                <span class="text-xs text-gray-500">Lid sinds {{ member.joinedAt | date:'shortDate' }}</span>
              </div>
            </div>
            <div *ngIf="canManageMembers && member.role !== 'teamleader'" class="flex gap-2">
              <button 
                *ngIf="member.role !== 'admin'"
                (click)="setAdmin(member.userId)"
                class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm font-bold border-2 border-black transition-colors">
                ADMIN MAKEN
              </button>
              <button 
                (click)="removeMember(member.userId)"
                class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm font-bold border-2 border-black transition-colors">
                VERWIJDEREN
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class GroupMembersComponent implements OnInit {
  @Input() groupId!: string;
  @Input() userRole: UserRole = UserRole.MEMBER;

  members: GroupMember[] = [];
  newMemberEmail = '';
  isLoading = false;

  constructor(private groupService: GroupService) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  get canManageMembers(): boolean {
    return this.userRole === UserRole.TEAMLEADER || this.userRole === UserRole.ADMIN;
  }

  loadMembers(): void {
    this.groupService.getGroupMembers(this.groupId).subscribe({
      next: (members) => this.members = members,
      error: (error) => console.error('Error loading members:', error)
    });
  }

  addMember(): void {
    if (!this.newMemberEmail || this.isLoading) return;
    
    this.isLoading = true;
    // In real implementation, you'd need to resolve email to userId first
    const userId = this.newMemberEmail; // Placeholder
    
    this.groupService.addMember(this.groupId, userId).subscribe({
      next: () => {
        this.loadMembers();
        this.newMemberEmail = '';
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error adding member:', error);
        this.isLoading = false;
      }
    });
  }

  removeMember(userId: string): void {
    this.groupService.removeMember(this.groupId, userId).subscribe({
      next: () => this.loadMembers(),
      error: (error) => console.error('Error removing member:', error)
    });
  }

  setAdmin(userId: string): void {
    this.groupService.setAdminStatus(this.groupId, userId).subscribe({
      next: () => this.loadMembers(),
      error: (error) => console.error('Error setting admin:', error)
    });
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'teamleader': return 'TEAMLEADER';
      case 'admin': return 'ADMIN';
      default: return 'LID';
    }
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'teamleader': return 'bg-red-500 text-white';
      case 'admin': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  }
}

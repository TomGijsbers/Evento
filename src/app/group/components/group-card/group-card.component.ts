import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Group, UserRole } from '../../../models/group.model';

@Component({
  selector: 'app-group-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform hover:scale-105 transition-transform">
      <div class="bg-red-600 h-2"></div>
      <div class="p-6">
        <h3 class="text-xl font-bold text-black mb-2 uppercase tracking-wide">{{ group.name }}</h3>
        <p class="text-gray-700 mb-4 font-medium">{{ group.description }}</p>
        <div class="flex justify-between items-center mb-4">
          <span class="bg-blue-600 text-white px-3 py-1 font-bold text-sm">
            {{ group.memberCount || 0 }} LEDEN
          </span>
          <span class="text-sm text-gray-600 font-medium">
            {{ group.createdAt ? (group.createdAt | date:'shortDate') : 'Onbekend' }}
          </span>
        </div>
        <div class="flex gap-2 flex-wrap">
          <button 
            (click)="onView.emit(group.id.toString())"
            class="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 font-bold border-2 border-black transition-colors">
            BEKIJKEN
          </button>
          <button 
            *ngIf="canEdit"
            (click)="onEdit.emit(group.id.toString())"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-bold border-2 border-black transition-colors">
            BEWERKEN
          </button>
          <button 
            *ngIf="canDelete"
            (click)="onDelete.emit(group.id.toString())"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 font-bold border-2 border-black transition-colors">
            VERWIJDEREN
          </button>
          <button 
            *ngIf="canLeave"
            (click)="onLeave.emit(group.id.toString())"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 font-bold border-2 border-black transition-colors">
            VERLATEN
          </button>
        </div>
      </div>
    </div>
  `
})
export class GroupCardComponent {
  @Input() group!: Group;
  @Input() userRole: UserRole = UserRole.MEMBER;
  @Input() isTeamLeader: boolean = false;
  
  @Output() onView = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onLeave = new EventEmitter<string>();

  get canEdit(): boolean {
    return this.userRole === UserRole.TEAMLEADER || this.userRole === UserRole.ADMIN;
  }

  get canDelete(): boolean {
    return this.isTeamLeader;
  }

  get canLeave(): boolean {
    return !this.isTeamLeader;
  }
}

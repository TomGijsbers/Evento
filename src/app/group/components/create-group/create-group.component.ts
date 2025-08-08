import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../../services/group.service';
import { CreateGroupRequest } from '../../../models/group.model';

@Component({
  selector: 'app-create-group',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white border-4 border-black max-w-md w-full mx-4">
        <div class="bg-blue-500 p-4">
          <h2 class="text-xl font-bold text-white uppercase tracking-wide">NIEUWE GROEP</h2>
        </div>
        <div class="p-6">
          <form (ngSubmit)="onSubmit()" #groupForm="ngForm">
            <div class="mb-4">
              <label class="block text-black font-bold mb-2 uppercase tracking-wide">NAAM</label>
              <input 
                type="text" 
                [(ngModel)]="groupData.name"
                name="name"
                required
                class="w-full px-3 py-2 border-2 border-black focus:border-blue-500 focus:outline-none font-medium"
                placeholder="Groepsnaam">
            </div>
            <div class="mb-6">
              <label class="block text-black font-bold mb-2 uppercase tracking-wide">OMSCHRIJVING</label>
              <textarea 
                [(ngModel)]="groupData.description"
                name="description"
                required
                rows="3"
                class="w-full px-3 py-2 border-2 border-black focus:border-blue-500 focus:outline-none font-medium"
                placeholder="Beschrijving van de groep"></textarea>
            </div>
            <div class="flex gap-3">
              <button 
                type="submit"
                [disabled]="!groupForm.valid || isLoading"
                class="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 font-bold border-2 border-black transition-colors">
                {{ isLoading ? 'BEZIG...' : 'AANMAKEN' }}
              </button>
              <button 
                type="button"
                (click)="onCancel.emit()"
                class="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 font-bold border-2 border-black transition-colors">
                ANNULEREN
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class CreateGroupComponent {
  @Output() onCancel = new EventEmitter<void>();
  @Output() onCreated = new EventEmitter<void>();

  groupData: CreateGroupRequest = {
    name: '',
    description: ''
  };
  
  isLoading = false;

  constructor(private groupService: GroupService) {}

  onSubmit(): void {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.groupService.createGroup(this.groupData).subscribe({
      next: () => {
        this.onCreated.emit();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creating group:', error);
        this.isLoading = false;
      }
    });
  }
}

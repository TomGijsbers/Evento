import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-card.component.html'
})
export class KpiCardComponent {
  @Input() value: number = 0;
  @Input() label: string = '';
  /** Tailwind-kleur zonder #  -> blue-600 / red-600 / yellow-400 … */
  @Input() colorClass: string = 'blue-600';
  /** Eén hoofdletter of icoon-letter voor de gekleurde cirkel */
  @Input() icon: string = 'E';
}

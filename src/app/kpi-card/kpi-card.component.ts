import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * KPI kaart component - toont statistieken met gekleurde styling
 */
@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-card.component.html'
})
export class KpiCardComponent {
  @Input() value: number = 0;           // Waarde om te tonen
  @Input() label: string = '';          // Label tekst
  @Input() colorClass: string = 'blue-600';  // Tailwind kleur (bijv. blue-600, red-600)
  @Input() icon: string = 'E';          // Icoon letter voor de gekleurde cirkel
}

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  /**
   * Toont een succesbericht aan de gebruiker
   * @param message Het bericht dat getoond moet worden
   */
  showSuccess(message: string): void {
    this.snackBar.open(message, 'Sluiten', {
      duration: 5000, // 5 seconden zichtbaar
      panelClass: ['success-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  /**
   * Toont een foutmelding aan de gebruiker
   * @param message Het foutbericht dat getoond moet worden
   */
  showError(message: string): void {
    this.snackBar.open(message, 'Sluiten', {
      duration: 7000, // 7 seconden zichtbaar voor foutmeldingen
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  /**
   * Toont een informatief bericht aan de gebruiker
   * @param message Het informatie bericht dat getoond moet worden
   */
  showInfo(message: string): void {
    this.snackBar.open(message, 'Sluiten', {
      duration: 4000, // 4 seconden zichtbaar
      panelClass: ['info-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}

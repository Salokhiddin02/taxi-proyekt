import { Component, Inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { ScheduledTaxi } from '../../services/scheduled-taxi';

@Component({
  selector: 'app-taxi-detail-modal',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    TranslateModule
  ],
  templateUrl: './taxi-detail-modal.html',
  styleUrl: './taxi-detail-modal.css'
})
export class TaxiDetailModalComponent {
  taxi: ScheduledTaxi;

  constructor(
    public dialogRef: MatDialogRef<TaxiDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ScheduledTaxi,
    private router: Router
  ) {
    this.taxi = data;
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  contactDriver(): void {
    console.log(`Contacting driver ${this.taxi.driver.name} via Telegram bot`);
    
    // Use Telegram's WebApp API to open the test bot
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink('https://t.me/taksilaruchuntest_bot');
    } else {
      // Fallback for development
      window.open('https://t.me/taksilaruchuntest_bot', '_blank');
    }
  }

  bookSeat(): void {
    console.log(`Booking seat for taxi ${this.taxi.id}`);
    
    // Close modal and navigate to booking
    this.dialogRef.close();
    this.router.navigate(['/booking'], { 
      queryParams: { 
        taxiId: this.taxi.id,
        departureTime: this.taxi.departureTime,
        from: this.taxi.route.from,
        to: this.taxi.route.to,
        price: this.taxi.price,
        duration: this.taxi.duration
      }
    });
  }

  getRatingStars(rating: number): string {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  }

  getAvailableSeatsText(available: number, total: number): string {
    if (available === 0) return 'scheduled.seats.full';
    if (available === 1) return 'scheduled.seats.oneLeft';
    return 'scheduled.seats.available';
  }

  getSeatsColor(available: number, total: number): string {
    if (available === 0) return '#FF3B30'; // Red
    if (available === 1) return '#FF9500'; // Orange
    return '#34C759'; // Green
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

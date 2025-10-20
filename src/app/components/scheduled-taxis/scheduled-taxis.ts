import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ScheduledTaxiService, ScheduledTaxi } from '../../services/scheduled-taxi';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaxiDetailModalComponent } from '../taxi-detail-modal/taxi-detail-modal';

@Component({
  selector: 'app-scheduled-taxis',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './scheduled-taxis.html',
  styleUrl: './scheduled-taxis.css'
})
export class ScheduledTaxisComponent implements OnInit {
  scheduledTaxis: ScheduledTaxi[] = [];
  isLoading = false;

  constructor(
    private scheduledTaxiService: ScheduledTaxiService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadScheduledTaxis();
  }

  loadScheduledTaxis(): void {
    this.isLoading = true;
    
    // Simulate API call delay
    setTimeout(() => {
      this.scheduledTaxis = this.scheduledTaxiService.getScheduledTaxis();
      this.isLoading = false;
    }, 1000);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  openTaxiDetails(taxi: ScheduledTaxi): void {
    const dialogRef = this.dialog.open(TaxiDetailModalComponent, {
      data: taxi,
      width: '90%',
      maxWidth: '500px',
      disableClose: false,
      panelClass: 'taxi-detail-modal-panel'
    });
  }

  contactDriver(taxi: ScheduledTaxi): void {
    console.log(`Contacting driver ${taxi.driver.name} via Telegram bot`);
    
    // Use Telegram's WebApp API to open the test bot
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink('https://t.me/taksilaruchuntest_bot');
    } else {
      // Fallback for development
      window.open('https://t.me/taksilaruchuntest_bot', '_blank');
    }
  }

  bookSeat(taxi: ScheduledTaxi): void {
    console.log(`Booking seat for taxi ${taxi.id}`);
    // Navigate to booking page or open booking modal
    this.router.navigate(['/booking'], { 
      queryParams: { 
        taxiId: taxi.id,
        departureTime: taxi.departureTime,
        from: taxi.route.from,
        to: taxi.route.to,
        price: taxi.price,
        duration: taxi.duration
      }
    });
  }

  formatTime(time: string): string {
    return time;
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
}

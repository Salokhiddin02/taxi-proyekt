import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DriverService, Driver } from '../../services/driver';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DriverDetailModalComponent } from '../driver-detail-modal/driver-detail-modal';

@Component({
  selector: 'app-drivers',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    CommonModule,
    TranslateModule,
    MatDialogModule,
    DriverDetailModalComponent
  ],
  templateUrl: './drivers.html',
  styleUrl: './drivers.css'
})
export class DriversComponent implements OnInit {
  drivers: Driver[] = [];
  tripInfo: any = {};
  isLoading = false;

  constructor(
    private driverService: DriverService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Get trip information from query params
    this.route.queryParams.subscribe(params => {
      this.tripInfo = {
        from: params['from'],
        to: params['to'],
        date: params['date'] ? new Date(params['date']) : null,
        passengers: params['passengers']
      };
    });

    // Load available drivers with loading state
    this.loadDrivers();
  }

  loadDrivers(): void {
    this.isLoading = true;
    
    // Simulate API call delay
    setTimeout(() => {
      this.drivers = this.driverService.getDrivers();
      this.isLoading = false;
    }, 1000);
  }

  contactDriver(driver: Driver): void {
    console.log(`Contacting ${driver.name} via Telegram`);
    
    // Use Telegram's WebApp API to open the test bot
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink('https://t.me/taksilaruchuntest_bot');
    } else {
      // Fallback for development
      window.open('https://t.me/taksilaruchuntest_bot', '_blank');
    }
  }

  formatDate(date: Date): string {
    if (!date) return '';
    return date.toLocaleDateString('uz-UZ', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getRatingStars(rating: number): string {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  }

  messageDriver(driver: Driver): void {
    console.log(`Messaging ${driver.name} via Telegram bot`);
    
    // Use Telegram's WebApp API to open the test bot
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink('https://t.me/taksilaruchuntest_bot');
    } else {
      // Fallback for development
      window.open('https://t.me/taksilaruchuntest_bot', '_blank');
    }
  }

  openDriver(driver: Driver): void {
    this.dialog.open(DriverDetailModalComponent, {
      data: {
        name: driver.name,
        car: driver.car,
        phone: driver.phone,
        rating: driver.rating,
        photos: ["", "", ""],
        carInfo: { year: 2021, color: 'Oq', plateNumber: '01A123BC' },
        reviews: [
          { userName: 'Akmal', rating: 5, date: new Date(), comment: 'Juda ham chiroyli haydaydi' },
          { userName: 'Dilshod', rating: 4, date: new Date(), comment: 'Vaqtida yetib keldi' }
        ]
      }
    });
  }

  refreshDrivers(): void {
    this.loadDrivers();
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}

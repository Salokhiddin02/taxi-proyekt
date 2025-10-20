import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-booking',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './booking.html',
  styleUrl: './booking.css'
})
export class BookingComponent implements OnInit {
  taxiId: string = '';
  departureTime: string = '';
  from: string = '';
  to: string = '';
  price: string = '';
  duration: string = '4h 30m'; // Default duration

  // Service fee constant
  private readonly SERVICE_FEE = 2000;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.taxiId = params['taxiId'] || '';
      this.departureTime = params['departureTime'] || '';
      this.from = params['from'] || '';
      this.to = params['to'] || '';
      this.price = params['price'] || '';
      this.duration = params['duration'] || '4h 30m'; // Dynamic duration from params
    });
  }

  goBack(): void {
    this.router.navigate(['/scheduled-taxis']);
  }

  confirmBooking(): void {
    console.log('Confirming booking for taxi:', this.taxiId);
    // In a real app, this would process the booking
    const message = this.translate?.instant('booking.success') || 'Booking confirmed! You will receive a confirmation message shortly.';
    
    // Better user experience - you can replace this with a proper toast notification service
    if (confirm(message)) {
      this.router.navigate(['/scheduled-taxis']);
    }
  }

  getTotalPrice(): string {
    const basePrice = parseInt(this.price.replace(/,/g, '')) || 0;
    return (basePrice + this.SERVICE_FEE).toLocaleString();
  }

  getTripDuration(): string {
    return this.duration;
  }

  getServiceFee(): string {
    return this.SERVICE_FEE.toLocaleString();
  }
}

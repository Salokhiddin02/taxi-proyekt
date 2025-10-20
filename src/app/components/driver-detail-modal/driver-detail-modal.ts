import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

export interface DriverReview {
  userName: string;
  rating: number;
  date: Date;
  comment: string;
}

export interface DriverDetailData {
  name: string;
  car: string;
  phone: string;
  rating?: number;
  photos?: string[]; // urls or base64, for now placeholders
  carInfo?: { year?: number; color?: string; plateNumber?: string };
  reviews?: DriverReview[];
}

@Component({
  selector: 'app-driver-detail-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule, TranslateModule],
  templateUrl: './driver-detail-modal.html',
  styleUrl: './driver-detail-modal.css'
})
export class DriverDetailModalComponent {
  constructor(
    public dialogRef: MatDialogRef<DriverDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DriverDetailData
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  getRatingStars(rating: number | undefined): string {
    const r = Math.floor(rating || 0);
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  }
}




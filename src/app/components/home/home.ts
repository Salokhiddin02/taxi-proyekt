import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { signal } from '@angular/core';

export interface TripData {
  from: string;
  to: string;
  date: Date;
  passengers: number;
}

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatAutocompleteModule,
    TranslateModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  tripForm: FormGroup;
  isSubmitting = false;
  selectedService = 'taxi';
  isGettingLocation = false;
  private translate = inject(TranslateService);
  currentLang = signal('uz');
  // District lists for Surxondaryo and Toshkent
  private readonly tashkentDistricts: string[] = [
    'Bektemir', 'Chilonzor', "Mirzo Ulug'bek", 'Mirobod', 'Olmazor', 'Sergeli', 'Shayxontohur', 'Uchtepa', 'Yakkasaroy', 'Yashnobod', 'Yunusobod',
    'Bekobod', 'Boʻka', 'Chinoz', 'Ohangaron', 'Oqqoʻrgʻon', 'Parkent', 'Piskent', 'Quyichirchiq', 'Yangiyoʻl', 'Zangiota'
  ];
  private readonly surxondaryoDistricts: string[] = [
    'Angor', 'Bandixon', 'Boysun', 'Denov', 'Jarqoʻrgʻon', 'Muzrabot', 'Oltinsoy', 'Qiziriq', 'Qumqoʻrgʻon', 'Sherobod', 'Sariosiyo', 'Shargʻun', 'Termiz', 'Uzun'
  ];
  allDistricts: string[] = [];
  filteredDistricts = signal<string[]>([]);
  filteredToDistricts = signal<string[]>([]);
  private selectedFromRegion: 'Toshkent' | 'Surxondaryo' | null = null;
  private toBaseList: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.tripForm = this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      date: ['', Validators.required],
      passengers: [1, [Validators.required, Validators.min(1), Validators.max(8)]]
    });

    // Prepare districts list with region tags
    this.allDistricts = [
      ...this.tashkentDistricts.map(d => `${d} (Toshkent)`),
      ...this.surxondaryoDistricts.map(d => `${d} (Surxondaryo)`)
    ];
    this.filteredDistricts.set(this.allDistricts);
    this.filteredToDistricts.set([]);

    // Filter by first letter as the user types in the From field
    const fromControl = this.tripForm.get('from');
    fromControl?.valueChanges.subscribe((value: string) => {
      const query = (value || '').trim();
      if (!query) {
        this.filteredDistricts.set(this.allDistricts);
        // reset selection and opposite list
        this.selectedFromRegion = null;
        this.toBaseList = [];
        this.filteredToDistricts.set([]);
        return;
      }
      const first = query[0].toLowerCase();
      this.filteredDistricts.set(
        this.allDistricts.filter(opt => opt.toLowerCase().startsWith(first))
      );

      // detect selected region from raw input if user types full district
      this.detectFromRegion(query);
      this.updateToSuggestions();
    });

    // Filter TO field by first letter but using opposite region list
    const toControl = this.tripForm.get('to');
    toControl?.valueChanges.subscribe((value: string) => {
      const query = (value || '').trim();
      if (!query) {
        this.filteredToDistricts.set(this.toBaseList);
        return;
      }
      const first = query[0]?.toLowerCase();
      this.filteredToDistricts.set(
        this.toBaseList.filter(opt => opt.toLowerCase().startsWith(first))
      );
    });
  }

  toggleLanguage(): void {
    const newLang = this.currentLang() === 'uz' ? 'ru' : 'uz';
    this.translate.use(newLang);
    this.currentLang.set(newLang);
    localStorage.setItem('language', newLang);
  }

  onFromSelected(value: string): void {
    // set value explicitly and update region/opposite list
    this.tripForm.patchValue({ from: value });
    this.detectFromRegion(value);
    this.updateToSuggestions(true);
  }

  private detectFromRegion(value: string): void {
    const v = (value || '').toLowerCase();
    const inToshkent = this.tashkentDistricts.some(d => v.startsWith(d.toLowerCase()));
    const inSurxon = this.surxondaryoDistricts.some(d => v.startsWith(d.toLowerCase()));
    if (v.includes('(toshkent)') || inToshkent) this.selectedFromRegion = 'Toshkent';
    else if (v.includes('(surxondaryo)') || inSurxon) this.selectedFromRegion = 'Surxondaryo';
  }

  private updateToSuggestions(resetControl: boolean = false): void {
    // Build opposite base list with region suffix
    if (this.selectedFromRegion === 'Toshkent') {
      this.toBaseList = this.surxondaryoDistricts.map(d => `${d} (Surxondaryo)`);
    } else if (this.selectedFromRegion === 'Surxondaryo') {
      this.toBaseList = this.tashkentDistricts.map(d => `${d} (Toshkent)`);
    } else {
      this.toBaseList = [];
    }
    if (resetControl) {
      // reset current TO value to force fresh filtering
      this.tripForm.patchValue({ to: '' });
    }
    const q = (this.tripForm.get('to')?.value || '').trim();
    if (!q) {
      this.filteredToDistricts.set(this.toBaseList);
    } else {
      const first = q[0]?.toLowerCase();
      this.filteredToDistricts.set(this.toBaseList.filter(o => o.toLowerCase().startsWith(first)));
    }
  }

  onSubmit(): void {
    if (this.tripForm.valid) {
      this.isSubmitting = true;
      
      // Simulate API call delay for better UX
      setTimeout(() => {
        const tripData: TripData = this.tripForm.value;
        // Navigate to drivers page with trip data
        this.router.navigate(['/drivers'], { 
          queryParams: { 
            from: tripData.from,
            to: tripData.to,
            date: tripData.date.toISOString(),
            passengers: tripData.passengers
          }
        });
        this.isSubmitting = false;
      }, 1500);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.tripForm.controls).forEach(key => {
        this.tripForm.get(key)?.markAsTouched();
      });
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.tripForm.get(fieldName);
    if (field?.hasError('required')) {
      return this.translate.instant('validation.required', { field: this.translate.instant(fieldName) });
    }
    if (field?.hasError('min')) {
      return this.translate.instant('validation.min', { min: field.getError('min').min });
    }
    if (field?.hasError('max')) {
      return this.translate.instant('validation.max', { max: field.getError('max').max });
    }
    return '';
  }

  selectService(service: string): void {
    this.selectedService = service;
  }

  navigateToScheduledTaxis(): void {
    this.router.navigate(['/scheduled-taxis']);
  }

  getUserLocation(): void {
    if (!navigator.geolocation) {
      this.showLocationError(this.translate.instant('location.error.notSupported'));
      return;
    }

    this.isGettingLocation = true;
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.reverseGeocode(latitude, longitude);
      },
      (error) => {
        this.isGettingLocation = false;
        this.handleLocationError(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  }

  private async reverseGeocode(latitude: number, longitude: number): Promise<void> {
    try {
      // Using OpenStreetMap Nominatim API for reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=uz,ru,en`
      );
      
      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }
      
      const data = await response.json();
      const address = this.formatAddress(data);
      this.tripForm.patchValue({ from: address });
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      // Fallback to coordinates if reverse geocoding fails
      const locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      this.tripForm.patchValue({ from: locationString });
    } finally {
      this.isGettingLocation = false;
    }
  }

  private formatAddress(data: any): string {
    const address = data.address || {};
    const parts = [];
    
    // Try to build a readable address
    if (address.road) parts.push(address.road);
    if (address.house_number) parts.push(address.house_number);
    if (address.suburb) parts.push(address.suburb);
    if (address.city || address.town || address.village) {
      parts.push(address.city || address.town || address.village);
    }
    if (address.state) parts.push(address.state);
    
    return parts.length > 0 ? parts.join(', ') : data.display_name || 'Current Location';
  }

  private handleLocationError(error: GeolocationPositionError): void {
    let errorKey = '';
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorKey = 'location.error.permissionDenied';
        break;
      case error.POSITION_UNAVAILABLE:
        errorKey = 'location.error.unavailable';
        break;
      case error.TIMEOUT:
        errorKey = 'location.error.timeout';
        break;
      default:
        errorKey = 'location.error.unknown';
        break;
    }
    
    this.showLocationError(this.translate.instant(errorKey));
  }

  private showLocationError(message: string): void {
    // For now, using alert. In a real app, you'd use a toast/snackbar service
    alert(message);
  }


}

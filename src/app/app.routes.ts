import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./components/home/home').then(m => m.HomeComponent) },
  { path: 'drivers', loadComponent: () => import('./components/drivers/drivers').then(m => m.DriversComponent) },
  { path: 'scheduled-taxis', loadComponent: () => import('./components/scheduled-taxis/scheduled-taxis').then(m => m.ScheduledTaxisComponent) },
  { path: 'booking', loadComponent: () => import('./components/booking/booking').then(m => m.BookingComponent) },
  { path: '**', redirectTo: '/home' }
];

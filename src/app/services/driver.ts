import { Injectable } from '@angular/core';

export interface Driver {
  name: string;
  car: string;
  phone: string;
  rating?: number;
  distance?: number;
  estimatedTime?: number;
  isOnline?: boolean;
  price?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  constructor() { }

  getDrivers(): Driver[] {
    // Mock driver data with enhanced properties
    return [
      { 
        name: "Jasur", 
        car: "Cobalt", 
        phone: "+998901234567",
        rating: 4.8,
        distance: 2.5,
        estimatedTime: 5,
        isOnline: true,
        price: "210,000"
      },
      { 
        name: "Anvar", 
        car: "Gentra", 
        phone: "+998933332211",
        rating: 4.6,
        distance: 3.2,
        estimatedTime: 7,
        isOnline: true,
        price: "225,000"
      },
      { 
        name: "Rustam", 
        car: "Malibu", 
        phone: "+998935556677",
        rating: 4.9,
        distance: 1.8,
        estimatedTime: 4,
        isOnline: true,
        price: "250,000"
      },
      { 
        name: "Bobur", 
        car: "Spark", 
        phone: "+998901112233",
        rating: 4.7,
        distance: 4.1,
        estimatedTime: 8,
        isOnline: false,
        price: "180,000"
      },
      { 
        name: "Sardor", 
        car: "Nexia", 
        phone: "+998934445566",
        rating: 4.5,
        distance: 2.9,
        estimatedTime: 6,
        isOnline: true,
        price: "200,000"
      }
    ];
  }
}

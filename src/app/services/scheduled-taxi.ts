import { Injectable } from '@angular/core';

export interface ScheduledTaxi {
  id: string;
  departureTime: string;
  route: {
    from: string;
    to: string;
  };
  driver: {
    name: string;
    phone: string;
    rating: number;
    photo?: string;
    experience: string;
  };
  car: {
    model: string;
    year: number;
    color: string;
    plateNumber: string;
    photos: string[];
  };
  availableSeats: number;
  totalSeats: number;
  price: number;
  duration: string;
  reviews: Review[];
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
  trip: string;
}

@Injectable({
  providedIn: 'root'
})
export class ScheduledTaxiService {

  constructor() { }

  getScheduledTaxis(): ScheduledTaxi[] {
    return [
      {
        id: '1',
        departureTime: '18:00',
        route: {
          from: 'Tashkent',
          to: 'Samarkand'
        },
        driver: {
          name: 'Akmal Rahimov',
          phone: '+998901234567',
          rating: 4.8,
          photo: '👨‍💼',
          experience: '5 years'
        },
        car: {
          model: 'Chevrolet Malibu',
          year: 2022,
          color: 'White',
          plateNumber: '01A123AB',
          photos: ['🚗', '🚗', '🚗']
        },
        availableSeats: 2,
        totalSeats: 4,
        price: 25000,
        duration: '4h 30m',
        reviews: [
          {
            id: '1',
            userName: 'Dilnoza',
            rating: 5,
            comment: 'Very comfortable ride and professional driver. Highly recommended!',
            date: new Date('2024-01-15'),
            trip: 'Tashkent → Samarkand'
          },
          {
            id: '2',
            userName: 'Bobur',
            rating: 4,
            comment: 'Good service, arrived on time. Car was clean.',
            date: new Date('2024-01-10'),
            trip: 'Tashkent → Samarkand'
          }
        ]
      },
      {
        id: '2',
        departureTime: '19:30',
        route: {
          from: 'Tashkent',
          to: 'Bukhara'
        },
        driver: {
          name: 'Sardor Karimov',
          phone: '+998933332211',
          rating: 4.9,
          photo: '👨‍💼',
          experience: '7 years'
        },
        car: {
          model: 'Hyundai Sonata',
          year: 2023,
          color: 'Black',
          plateNumber: '01B456CD',
          photos: ['🚗', '🚗', '🚗']
        },
        availableSeats: 1,
        totalSeats: 4,
        price: 35000,
        duration: '6h 15m',
        reviews: [
          {
            id: '3',
            userName: 'Malika',
            rating: 5,
            comment: 'Excellent driver! Very safe and comfortable journey.',
            date: new Date('2024-01-12'),
            trip: 'Tashkent → Bukhara'
          }
        ]
      },
      {
        id: '3',
        departureTime: '20:00',
        route: {
          from: 'Tashkent',
          to: 'Samarkand'
        },
        driver: {
          name: 'Jasur Toshev',
          phone: '+998935556677',
          rating: 4.7,
          photo: '👨‍💼',
          experience: '4 years'
        },
        car: {
          model: 'Toyota Camry',
          year: 2021,
          color: 'Silver',
          plateNumber: '01C789EF',
          photos: ['🚗', '🚗', '🚗']
        },
        availableSeats: 3,
        totalSeats: 4,
        price: 22000,
        duration: '4h 45m',
        reviews: [
          {
            id: '4',
            userName: 'Aziza',
            rating: 4,
            comment: 'Good driver, punctual and friendly.',
            date: new Date('2024-01-08'),
            trip: 'Tashkent → Samarkand'
          }
        ]
      },
      {
        id: '4',
        departureTime: '21:15',
        route: {
          from: 'Samarkand',
          to: 'Tashkent'
        },
        driver: {
          name: 'Rustam Usmanov',
          phone: '+998901112233',
          rating: 4.6,
          photo: '👨‍💼',
          experience: '3 years'
        },
        car: {
          model: 'Nissan Teana',
          year: 2020,
          color: 'Blue',
          plateNumber: '01D012GH',
          photos: ['🚗', '🚗', '🚗']
        },
        availableSeats: 2,
        totalSeats: 4,
        price: 24000,
        duration: '4h 20m',
        reviews: [
          {
            id: '5',
            userName: 'Otabek',
            rating: 4,
            comment: 'Comfortable car and professional service.',
            date: new Date('2024-01-05'),
            trip: 'Samarkand → Tashkent'
          }
        ]
      }
    ];
  }

  getTaxiById(id: string): ScheduledTaxi | undefined {
    return this.getScheduledTaxis().find(taxi => taxi.id === id);
  }
}



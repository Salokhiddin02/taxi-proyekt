import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  isDarkMode = false;
  private translate = inject(TranslateService);
  private router = inject(Router);
  currentLang = signal('uz');
  currentTime = signal('');

  constructor() {
    // Load dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      this.isDarkMode = true;
      document.body.classList.add('dark');
    }

    // Initialize clock
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  getLanguageName(): string {
    return this.currentLang() === 'uz' ? "O'zbek" : 'Русский';
  }

  toggleLanguage(): void {
    const newLang = this.currentLang() === 'uz' ? 'ru' : 'uz';
    this.translate.use(newLang);
    this.currentLang.set(newLang);
    localStorage.setItem('language', newLang);
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    // Toggle dark mode class on document body
    if (this.isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }

  navigateToHome(): void {
    // Navigate back to home page using Angular Router
    this.router.navigate(['/']);
  }

  updateTime(): void {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
    this.currentTime.set(timeString);
  }

  getCurrentTime(): string {
    return this.currentTime();
  }
}

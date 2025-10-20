import { Component, OnInit, signal, inject, HostBinding } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from './components/navbar/navbar';

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
        version: string;
        platform: string;
        colorScheme: 'light' | 'dark';
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        isClosingConfirmationEnabled: boolean;
        headerColor: string;
        backgroundColor: string;
        BackButton: {
          isVisible: boolean;
          show(): void;
          hide(): void;
          onClick(callback: () => void): void;
          offClick(callback: () => void): void;
        };
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isProgressVisible: boolean;
          isActive: boolean;
          setText(text: string): void;
          onClick(callback: () => void): void;
          offClick(callback: () => void): void;
          show(): void;
          hide(): void;
          enable(): void;
          disable(): void;
          showProgress(leaveActive?: boolean): void;
          hideProgress(): void;
          setParams(params: {
            text?: string;
            color?: string;
            text_color?: string;
            is_active?: boolean;
            is_visible?: boolean;
          }): void;
        };
        expand(): void;
        close(): void;
        ready(): void;
        sendData(data: string): void;
        openLink(url: string, options?: { try_instant_view?: boolean }): void;
        openTelegramLink(url: string): void;
        openInvoice(url: string, callback?: (status: string) => void): void;
        showPopup(params: {
          title?: string;
          message: string;
          buttons?: Array<{
            id?: string;
            type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
            text?: string;
          }>;
        }, callback?: (buttonId: string) => void): void;
        showAlert(message: string, callback?: () => void): void;
        showConfirm(message: string, callback?: (confirmed: boolean) => void): void;
        showScanQrPopup(params: {
          text?: string;
        }, callback?: (text: string) => void): void;
        closeScanQrPopup(): void;
        readTextFromClipboard(callback?: (text: string) => void): void;
        requestWriteAccess(callback?: (granted: boolean) => void): void;
        requestContact(callback?: (granted: boolean) => void): void;
        onEvent(eventType: string, eventHandler: () => void): void;
        offEvent(eventType: string, eventHandler: () => void): void;
      };
    };
  }
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, TranslateModule, MatIconModule, MatButtonModule, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  @HostBinding('class') get themeClass() {
    return this.isDarkTheme() ? 'dark' : 'light';
  }

  protected readonly title = signal('taxi-webapp');
  tg: any;
  private isDarkMode = signal(false);
  private router = inject(Router);
  public translate = inject(TranslateService);
  currentLang = signal('uz');

  ngOnInit(): void {
    // Restore theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode.set(true);
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#17212b';
      document.body.style.color = '#ffffff';
    } else {
      this.isDarkMode.set(false);
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#000000';
    }
    // ...existing code...
    try {
      this.initializeTranslations();
      // ...existing code...
      if (window.Telegram?.WebApp) {
        this.tg = window.Telegram.WebApp;
        this.tg.ready();
        this.tg.expand();
        this.tg.MainButton.hide();
        this.tg.BackButton.hide();
        const user = this.tg.initDataUnsafe.user;
        if (user) {
          if (user.language_code === 'ru' || user.language_code === 'uz') {
            this.switchLanguage(user.language_code);
          }
        }
        this.applyTelegramTheme();
        this.tg.onEvent('themeChanged', () => {
          this.applyTelegramTheme();
        });
      } else {
        this.initializeFallbackTheme();
      }
    } catch (error) {
      // ...existing code...
    }
  }

  initializeTranslations(): void {
    try {
      console.log('Initializing translations...');
      
      // Set available languages
      this.translate.addLangs(['uz', 'ru']);
      
      // Set default language
      this.translate.setDefaultLang('uz');
      
      // Get saved language from localStorage or use default
      const savedLang = localStorage.getItem('language') || 'uz';
      this.currentLang.set(savedLang);
      
      // Load the language and wait for it to complete
      this.translate.use(savedLang).subscribe({
        next: () => {
          console.log('Translations loaded successfully for language:', savedLang);
        },
        error: (error) => {
          console.error('Error loading translations:', error);
          // Fallback to default language
          this.translate.use('uz');
          this.currentLang.set('uz');
        }
      });
    } catch (error) {
      console.error('Error initializing translations:', error);
      // Fallback to default language
      this.translate.use('uz');
      this.currentLang.set('uz');
    }
  }

  switchLanguage(lang: string): void {
    this.translate.use(lang).subscribe({
      next: () => {
        this.currentLang.set(lang);
        localStorage.setItem('language', lang);
        console.log('Language switched to:', lang);
      },
      error: (error) => {
        console.error('Error switching language:', error);
      }
    });
  }

  toggleLanguage(): void {
    const newLang = this.currentLang() === 'uz' ? 'ru' : 'uz';
    this.switchLanguage(newLang);
  }

  getLanguageFlag(): string {
    return this.currentLang() === 'uz' ? '🇺🇿' : '🇷🇺';
  }

  getLanguageName(): string {
    return this.currentLang() === 'uz' ? 'O\'zbekcha' : 'Русский';
  }

  isDarkTheme(): boolean {
    if (this.tg) {
      return this.tg.colorScheme === 'dark';
    }
    return this.isDarkMode();
  }

  closeApp(): void {
    if (this.tg) {
      // Use Telegram WebApp close method
      this.tg.close();
    } else {
      // Fallback for development - show confirmation
      if (confirm(this.translate.instant('app.closeConfirm'))) {
        // Try to close the window, fallback to history back
        try {
          window.close();
        } catch (e) {
          window.history.back();
        }
      }
    }
  }

  navigateToHome(): void {
    // Navigate back to home page using Angular Router
    this.router.navigate(['/']);
  }

  goBack(): void {
    // Navigate back in history
    window.history.back();
  }

  showBackButton(): boolean {
    // Show back button when not on home page
    return this.router.url !== '/';
  }

  private applyTelegramTheme(): void {
    if (!this.tg) return;
    
    const theme = this.tg.colorScheme;
    const themeParams = this.tg.themeParams;
    
    // Apply theme colors to document
    document.documentElement.style.setProperty('--tg-bg-color', themeParams.bg_color || (theme === 'dark' ? '#17212b' : '#ffffff'));
    document.documentElement.style.setProperty('--tg-text-color', themeParams.text_color || (theme === 'dark' ? '#ffffff' : '#000000'));
    document.documentElement.style.setProperty('--tg-hint-color', themeParams.hint_color || (theme === 'dark' ? '#aaaaaa' : '#999999'));
    document.documentElement.style.setProperty('--tg-button-color', themeParams.button_color || (theme === 'dark' ? '#64a9dc' : '#2481cc'));
    document.documentElement.style.setProperty('--tg-button-text-color', themeParams.button_text_color || '#ffffff');
    
    // Set body background and text color
    document.body.style.backgroundColor = themeParams.bg_color || (theme === 'dark' ? '#17212b' : '#ffffff');
    document.body.style.color = themeParams.text_color || (theme === 'dark' ? '#ffffff' : '#000000');
    
    // Update dark mode signal
    this.isDarkMode.set(theme === 'dark');
  }

  private initializeFallbackTheme(): void {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    this.isDarkMode.set(shouldUseDark);
    
    // Apply fallback theme colors
    if (shouldUseDark) {
      document.documentElement.style.setProperty('--tg-bg-color', '#17212b');
      document.documentElement.style.setProperty('--tg-text-color', '#ffffff');
      document.documentElement.style.setProperty('--tg-hint-color', '#aaaaaa');
      document.documentElement.style.setProperty('--tg-button-color', '#64a9dc');
      document.body.style.backgroundColor = '#17212b';
      document.body.style.color = '#ffffff';
    }
  }

  toggleTheme(): void {
    const newMode = !this.isDarkMode();
    this.isDarkMode.set(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    if (newMode) {
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#17212b';
      document.body.style.color = '#ffffff';
    } else {
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#000000';
    }
  }
}

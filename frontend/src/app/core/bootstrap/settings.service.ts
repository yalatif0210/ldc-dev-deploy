import { Direction } from '@angular/cdk/bidi';
import { MediaMatcher } from '@angular/cdk/layout';
import { Injectable, inject, DOCUMENT } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppDirectionality, LocalStorageService } from '@shared';
import { enUS, Locale, zhCN, zhTW } from 'date-fns/locale';
import { BehaviorSubject } from 'rxjs';
import { AppSettings, AppTheme, defaults, guest_users } from '../settings';
import { AuthService, UserRole } from '@core';
import { NgxRolesService } from 'ngx-permissions';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly key = 'ldc-settings';

  private readonly document = inject(DOCUMENT);
  private readonly translate = inject(TranslateService);
  private readonly store = inject(LocalStorageService);
  private readonly mediaMatcher = inject(MediaMatcher);
  private readonly dir = inject(AppDirectionality);
  private readonly auth = inject(AuthService);
  private readonly rolesSrv = inject(NgxRolesService);

  private readonly notify$ = new BehaviorSubject<Partial<AppSettings>>({});


  get notify() {
    return this.notify$.asObservable();
  }

  private htmlElement = this.document.querySelector('html')!;

  private storedOptions: AppSettings = this.store.get(this.key);

  options: AppSettings = Object.assign(defaults, this.storedOptions);

  languages = ['en-US', 'zh-CN', 'zh-TW'];

  localeMap: Record<string, Locale> = { 'en-US': enUS, 'zh-CN': zhCN, 'zh-TW': zhTW };

  constructor() {
    this.translate.addLangs(this.languages);
    this.auth.userRole().subscribe(role => {
      this.setOptions({ navPos: 'top' });
      //if (role && role.includes(UserRole.USER)) {
      //  this.setOptions({ navPos: 'top' });
      //} else {
      //  this.setOptions({ navPos: 'side' });
      //}
    });
  }

  reset() {
    this.store.remove(this.key);
  }

  setOptions(options?: Partial<AppSettings>) {
    console.log('SettingsService: setOptions() called with', options);
    this.options = Object.assign(defaults, this.options, options);
    this.store.set(this.key, this.options);
    this.notify$.next(this.options);
  }

  setDirection(dir?: Direction) {
    if (dir) {
      this.setOptions({ dir });
    }
    this.dir.value = this.options.dir;
    this.htmlElement.dir = this.options.dir;
  }

  getThemeColor() {
    // Check whether the browser support `prefers-color-scheme`
    if (
      this.options.theme === 'auto' &&
      this.mediaMatcher.matchMedia('(prefers-color-scheme)').media !== 'not all'
    ) {
      const isSystemDark = this.mediaMatcher.matchMedia('(prefers-color-scheme: dark)').matches;
      // Set theme to dark if `prefers-color-scheme` is dark. Otherwise, set it to light.
      return isSystemDark ? 'dark' : 'light';
    } else {
      return this.options.theme as Exclude<AppTheme, 'auto'>;
    }
  }

  setTheme(theme?: AppTheme) {
    if (theme) {
      this.setOptions({ theme });
    }
    if (this.getThemeColor() === 'dark') {
      this.htmlElement.classList.add('theme-dark');
    } else {
      this.htmlElement.classList.remove('theme-dark');
    }
  }

  getTranslateLang() {
    if (this.options.language === 'auto') {
      const browserLang = navigator.language;
      return this.languages.includes(browserLang) ? browserLang : 'en-US';
    }
    return this.options.language;
  }

  setLanguage(language?: string) {
    if (language) {
      this.setOptions({ language });
    }
    this.translate.use(this.getTranslateLang());
  }

  getLocale() {
    return this.localeMap[this.getTranslateLang()];
  }
}

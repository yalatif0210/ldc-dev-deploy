import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  isDevMode,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_CARD_CONFIG } from '@angular/material/card';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { provideDateFnsDatetimeAdapter } from '@ng-matero/extensions-date-fns-adapter';
import { FORMLY_CONFIG, provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';
import { provideTranslateService, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { NgxPermissionsModule } from 'ngx-permissions';
import { provideToastr } from 'ngx-toastr';

import {
  BASE_URL,
  interceptors,
  SettingsService,
  StartupService,
  TranslateLangService,
} from '@core';
import { environment } from '@env/environment';
import { formlyConfigFactory, PaginatorI18nService } from '@shared';
import { InMemDataService } from '@shared/in-mem/in-mem-data.service';
import { routes } from './app.routes';
import {
  API_BASE_URL,
  API_BASE_PORT,
  API_GRAPHQL_END_POINT,
  API_REST_END_POINT,
} from '@core/api-token';
import { AppDataService } from '@core/ssr/internal-api';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: BASE_URL, useValue: environment.baseUrl },
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
    { provide: API_BASE_PORT, useValue: environment.apiBasePort },
    { provide: API_GRAPHQL_END_POINT, useValue: environment.graphqlEndPoint },
    { provide: API_REST_END_POINT, useValue: environment.apiRestEndPoint },
    provideAppInitializer(() => inject(TranslateLangService).load()),
    provideAppInitializer(() => inject(StartupService).load()),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors(interceptors)),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      withComponentInputBinding()
    ),
    provideToastr(),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, 'i18n/', '.json'),
        deps: [HttpClient],
      },
    }),
    importProvidersFrom(
      NgxPermissionsModule.forRoot(),
      // 👇 ❌ This is only used for demo purpose, remove it in the realworld application
      InMemoryWebApiModule.forRoot(AppDataService, {
        dataEncapsulation: false,
        passThruUnknownUrl: true,
      })
    ),
    provideFormlyCore([...withFormlyMaterial()]),
    {
      provide: FORMLY_CONFIG,
      useFactory: formlyConfigFactory,
      deps: [TranslateService],
      multi: true,
    },
    {
      provide: MatPaginatorIntl,
      useFactory: (paginatorI18nSrv: PaginatorI18nService) => paginatorI18nSrv.getPaginatorIntl(),
      deps: [PaginatorI18nService],
    },
    {
      provide: MAT_DATE_LOCALE,
      useFactory: () => inject(SettingsService).getLocale(),
    },
    {
      provide: MAT_CARD_CONFIG,
      useValue: {
        appearance: 'outlined',
      },
    },
    provideDateFnsAdapter({
      parse: {
        dateInput: 'dd-MM-yyyy',
      },
      display: {
        dateInput: 'dd-MM-yyyy',
        monthYearLabel: 'yyyy MMM',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'yyyy MMM',
      },
    }),
    provideDateFnsDatetimeAdapter({
      parse: {
        dateInput: 'dd-MM-yyyy',
        yearInput: 'yyyy',
        monthInput: 'MMMM',
        datetimeInput: 'dd-MM-yyyy HH:mm',
        timeInput: 'HH:mm',
      },
      display: {
        dateInput: 'dd-MM-yyyy',
        yearInput: 'yyyy',
        monthInput: 'MMMM',
        datetimeInput: 'dd-MM-yyyy HH:mm',
        timeInput: 'HH:mm',
        monthYearLabel: 'yyyy MMMM',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM yyyy',
        popupHeaderDateLabel: 'MMM dd, E',
      },
    }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};

import { DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JwtInterceptor, JwtModule } from '@auth0/angular-jwt';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { DateFnsModule } from 'ngx-date-fns';
import { ToastrModule } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ROOT_REDUCERS } from './app.reducers';
import { ToastrComponent } from './common/components/toastr/toastr.component';
import { AppInitializer } from './common/config/app-init.service';
import { InputFormDirective } from './common/directives/input-form.directive';
import { AuthInterceptor } from './common/interceptors/auth.interceptor';
import { HttpErrorsInterceptor } from './common/interceptors/http-errors.interceptor';
import { ContentComponent } from './layouts/content/content.component';
import { FullModule } from './layouts/full/full.module';
import { AffairModule } from './pages/catalogs/affair/affair.module';
import { LegalAffairModule } from './pages/catalogs/legal-affair/legal-affair.module';
import { TransferorsModule } from './pages/catalogs/transferors/transferors.module';
import { AuthorizationKeysModule } from './pages/commercialization/catalogs/authorization-keys/authorization-keys.module';
import { CatTransferentModule } from './pages/parameterization/cat-transferent/cat-transferent.module';
import { MailModule } from './pages/parameterization/mail/mail.module';
import { DatePickerModule } from './shared/components/datepicker-element-smarttable/datapicker.module';
import { LoadingComponent } from './shared/components/loading/loading.component';

export function tokenGetter() {
  return localStorage.getItem('token');
}

export function servicesOnRun(app: AppInitializer) {
  return () => app.load();
}

@NgModule({
  declarations: [
    AppComponent,
    ContentComponent,
    InputFormDirective,
    LoadingComponent,
    ToastrComponent,
  ],
  imports: [
    BrowserModule,
    FullModule,
    DatePickerModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:3000'],
        disallowedRoutes: [],
      },
    }),
    StoreModule.forRoot(ROOT_REDUCERS, {
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false,
      },
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    AppRoutingModule,
    HttpClientModule,
    DateFnsModule.forRoot(),
    MailModule,
    CatTransferentModule,
    AuthorizationKeysModule,
    AffairModule,
    LegalAffairModule,
    TransferorsModule,
    ToastrModule.forRoot({
      tapToDismiss: true,
      closeButton: true,
      progressBar: true,
      timeOut: 6000,
      preventDuplicates: true,
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorsInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    AppInitializer,
    {
      provide: APP_INITIALIZER,
      useFactory: servicesOnRun,
      multi: true,
      deps: [AppInitializer],
    },
    JwtInterceptor,
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JwtInterceptor, JwtModule } from '@auth0/angular-jwt';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { DateFnsModule } from 'ngx-date-fns';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ROOT_REDUCERS } from './app.reducers';
import { InputFormDirective } from './common/directives/input-form.directive';
import { AuthInterceptor } from './common/interceptors/auth.interceptor';
import { HttpErrorsInterceptor } from './common/interceptors/http-errors.interceptor';
import { ContentComponent } from './layouts/content/content.component';
import { FullModule } from './layouts/full/full.module';
import { AuthorizationKeysModule } from './pages/commercialization/catalogs/authorization-keys/authorization-keys.module';
import { CatTransferentModule } from './pages/parameterization/cat-transferent/cat-transferent.module';
import { MailModule } from './pages/parameterization/mail/mail.module';
export function tokenGetter() {
  return localStorage.getItem('token');
}
@NgModule({
  declarations: [AppComponent, ContentComponent, InputFormDirective],
  imports: [
    BrowserModule,
    FullModule,
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
    JwtInterceptor,
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

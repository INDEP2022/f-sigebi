import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JwtInterceptor, JwtModule } from '@auth0/angular-jwt';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { DateFnsModule } from 'ngx-date-fns';
import { environment } from 'src/environments/environment.prod';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputFormDirective } from './common/directives/input-form.directive';
import { HttpErrorsInterceptor } from './common/interceptors/http-errors.interceptor';
import { ContentComponent } from './layouts/content/content.component';
import { FullModule } from './layouts/full/full.module';
import { counterReducer } from './pages/admin/reducer/home.reducer';
import { generateReducer } from './pages/request/generate-sampling-supervision/generate-formats-verify-noncompliance/store/reducer';

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
    StoreModule.forRoot({
      count: counterReducer,
      Item: generateReducer,
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    AppRoutingModule,
    HttpClientModule,
    DateFnsModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorsInterceptor,
      multi: true,
    },
    JwtInterceptor,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

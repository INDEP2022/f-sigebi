import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContentComponent } from './layouts/content/content.component';
import { FullModule } from './layouts/full/full.module';
import { InputFormDirective } from './common/directives/input-form.directive';
import { HttpErrorsInterceptor } from './common/interceptors/http-errors.interceptor';
import { JwtInterceptor, JwtModule } from '@auth0/angular-jwt';

export function tokenGetter() {
  return localStorage.getItem('token');
}
@NgModule({
  declarations: [AppComponent, ContentComponent, InputFormDirective,],
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
    AppRoutingModule,
    HttpClientModule,
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
export class AppModule {
 
}

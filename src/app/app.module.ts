import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContentComponent } from './layouts/content/content.component';
import { FullModule } from './layouts/full/full.module';
import { InputFormDirective } from './common/directives/input-form.directive';
import { HttpErrorsInterceptor } from './common/interceptors/http-errors.interceptor';

@NgModule({
  declarations: [AppComponent, ContentComponent, InputFormDirective],
  imports: [
    BrowserModule, 
    FullModule, 
    AppRoutingModule,
     HttpClientModule
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorsInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

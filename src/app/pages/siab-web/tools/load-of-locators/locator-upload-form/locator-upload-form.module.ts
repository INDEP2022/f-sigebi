import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlertModule } from 'ngx-bootstrap/alert';
import { SharedModule } from 'src/app/shared/shared.module';
import { LocatorUploadFormRoutingModule } from './locator-upload-form-routing.module';
import { LocatorUploadFormComponent } from './locator-upload-form/locator-upload-form.component';

@NgModule({
  declarations: [LocatorUploadFormComponent],
  imports: [
    CommonModule,
    LocatorUploadFormRoutingModule,
    SharedModule,
    AlertModule.forRoot(),
  ],
})
export class LocatorUploadFormModule {}

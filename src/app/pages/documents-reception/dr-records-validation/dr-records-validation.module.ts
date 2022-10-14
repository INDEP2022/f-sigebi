import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrRecordsValidationRoutingModule } from './dr-records-validation-routing.module';
import { DrRecordsValidationComponent } from './dr-records-validation/dr-records-validation.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [DrRecordsValidationComponent],
  imports: [CommonModule, DrRecordsValidationRoutingModule, SharedModule],
})
export class DrRecordsValidationModule {}

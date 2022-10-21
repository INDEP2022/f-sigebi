import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DrRecordsValidationRoutingModule } from './dr-records-validation-routing.module';
import { DrRecordsValidationComponent } from './dr-records-validation/dr-records-validation.component';

@NgModule({
  declarations: [DrRecordsValidationComponent],
  imports: [CommonModule, DrRecordsValidationRoutingModule, SharedModule],
})
export class DrRecordsValidationModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecordsValidationRoutingModule } from './records-validation-routing.module';
import { RecordsValidationComponent } from './records-validation/records-validation.component';

@NgModule({
  declarations: [RecordsValidationComponent],
  imports: [CommonModule, RecordsValidationRoutingModule, SharedModule],
})
export class RecordsValidationModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ClosingConfiscationAndReturnRecordsRoutingModule } from './closing-confiscation-and-return-records-routing.module';
import { ClosingRecordsComponent } from './closing-records/closing-records.component';
import { FormEditComponent } from './form-edit/form-edit.component';

@NgModule({
  declarations: [ClosingRecordsComponent, FormEditComponent],
  imports: [
    CommonModule,
    ClosingConfiscationAndReturnRecordsRoutingModule,
    SharedModule,
  ],
})
export class ClosingConfiscationAndReturnRecordsModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ClosingConfiscationAndReturnRecordsRoutingModule } from './closing-confiscation-and-return-records-routing.module';
import { ClosingRecordsComponent } from './closing-records/closing-records.component';

@NgModule({
  declarations: [ClosingRecordsComponent],
  imports: [
    CommonModule,
    ClosingConfiscationAndReturnRecordsRoutingModule,
    SharedModule,
  ],
})
export class ClosingConfiscationAndReturnRecordsModule {}

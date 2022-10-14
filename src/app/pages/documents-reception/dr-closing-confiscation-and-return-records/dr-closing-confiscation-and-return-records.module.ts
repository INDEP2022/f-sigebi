import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { DrClosingConfiscationAndReturnRecordsRoutingModule } from './dr-closing-confiscation-and-return-records-routing.module';
import { DrClosingRecordsComponent } from './dr-closing-records/dr-closing-records.component';

@NgModule({
  declarations: [DrClosingRecordsComponent],
  imports: [
    CommonModule,
    DrClosingConfiscationAndReturnRecordsRoutingModule,
    SharedModule,
  ],
})
export class DrClosingConfiscationAndReturnRecordsModule {}

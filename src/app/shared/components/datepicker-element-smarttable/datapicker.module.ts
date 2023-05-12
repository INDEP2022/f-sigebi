import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DatePickerElementComponent } from './datepicker.component';

@NgModule({
  declarations: [DatePickerElementComponent],
  imports: [CommonModule, FormsModule, BsDatepickerModule.forRoot()],
  exports: [DatePickerElementComponent],
})
export class DatePickerModule {}

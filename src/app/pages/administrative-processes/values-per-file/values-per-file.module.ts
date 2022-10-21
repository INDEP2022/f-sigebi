import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../shared/shared.module';
import { ValuesPerFileRoutingModule } from './values-per-file-routing.module';
import { ValuesPerFileComponent } from './values-per-file/values-per-file.component';

@NgModule({
  declarations: [ValuesPerFileComponent],
  imports: [
    CommonModule,
    ValuesPerFileRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
  ],
})
export class ValuesPerFileModule {}

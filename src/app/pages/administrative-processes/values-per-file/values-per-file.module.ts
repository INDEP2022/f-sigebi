import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValuesPerFileRoutingModule } from './values-per-file-routing.module';
import { ValuesPerFileComponent } from './values-per-file/values-per-file.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

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

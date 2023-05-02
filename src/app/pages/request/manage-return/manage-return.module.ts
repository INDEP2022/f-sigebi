import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import {
  BsDatepickerConfig,
  BsDatepickerModule,
} from 'ngx-bootstrap/datepicker';
import { ManageReturnRoutingModule } from './manage-return-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ManageReturnRoutingModule,
    BsDatepickerModule.forRoot(),
    SharedModule,
  ],
  providers: [BsDatepickerConfig],
})
export class ManageReturnModule {}

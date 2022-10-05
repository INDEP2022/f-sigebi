import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { PeRddxdeesMReceptionAreaSeraRoutingModule } from './pe-rddxdees-m-reception-area-sera-routing.module';
import { PeRddxdeesCReceptionAreaSeraComponent } from './pe-rddxdees-c-reception-area-sera/pe-rddxdees-c-reception-area-sera.component';


@NgModule({
  declarations: [
    PeRddxdeesCReceptionAreaSeraComponent
  ],
  imports: [
    CommonModule,
    PeRddxdeesMReceptionAreaSeraRoutingModule,
    SharedModule,
    BsDatepickerModule
  ]
})
export class PeRddxdeesMReceptionAreaSeraModule { }

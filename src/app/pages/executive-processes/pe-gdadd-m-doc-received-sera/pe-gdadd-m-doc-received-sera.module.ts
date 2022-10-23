import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module'; 
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DateRangeSharedComponent } from 'src/app/@standalone/shared-forms/date-range-shared/date-range-shared.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';

import { PeGdaddMDocReceivedSeraRoutingModule } from './pe-gdadd-m-doc-received-sera-routing.module';
import { PeGdaddCDocReceivedSeraComponent } from './pe-gdadd-c-doc-received-sera/pe-gdadd-c-doc-received-sera.component';


@NgModule({
  declarations: [
    PeGdaddCDocReceivedSeraComponent
  ],
  imports: [
    CommonModule,
    PeGdaddMDocReceivedSeraRoutingModule,
    SharedModule,
    BsDatepickerModule,
    DelegationSharedComponent,
    DateRangeSharedComponent,
  ]
})
export class PeGdaddMDocReceivedSeraModule { }

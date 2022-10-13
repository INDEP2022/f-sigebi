import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { DateRangeSharedComponent } from 'src/app/@standalone/shared-forms/date-range-shared/date-range-shared.component';

import { PeDrpaeMDocReceivedAuthorityRoutingModule } from './pe-drpae-m-doc-received-authority-routing.module';
import { PeDrpaeCDocReceivedAuthorityComponent } from './pe-drpae-c-doc-received-authority/pe-drpae-c-doc-received-authority.component';


@NgModule({
  declarations: [
    PeDrpaeCDocReceivedAuthorityComponent
  ],
  imports: [
    CommonModule,
    PeDrpaeMDocReceivedAuthorityRoutingModule,
    SharedModule,
    BsDatepickerModule,
    DelegationSharedComponent,
    DateRangeSharedComponent
  ]
})
export class PeDrpaeMDocReceivedAuthorityModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

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
    BsDatepickerModule
  ]
})
export class PeDrpaeMDocReceivedAuthorityModule { }

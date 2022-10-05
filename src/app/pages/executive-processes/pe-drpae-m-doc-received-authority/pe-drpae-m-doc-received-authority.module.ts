import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeDrpaeMDocReceivedAuthorityRoutingModule } from './pe-drpae-m-doc-received-authority-routing.module';
import { PeDrpaeCDocReceivedAuthorityComponent } from './pe-drpae-c-doc-received-authority/pe-drpae-c-doc-received-authority.component';


@NgModule({
  declarations: [
    PeDrpaeCDocReceivedAuthorityComponent
  ],
  imports: [
    CommonModule,
    PeDrpaeMDocReceivedAuthorityRoutingModule
  ]
})
export class PeDrpaeMDocReceivedAuthorityModule { }

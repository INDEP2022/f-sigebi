import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { ModalModule } from 'ngx-bootstrap/modal';

import { PeDrpaeCDocReceivedAuthorityComponent } from './pe-drpae-c-doc-received-authority/pe-drpae-c-doc-received-authority.component';
import { PeDrpaeMDocReceivedAuthorityRoutingModule } from './pe-drpae-m-doc-received-authority-routing.module';

@NgModule({
  declarations: [PeDrpaeCDocReceivedAuthorityComponent],
  imports: [
    CommonModule,
    PeDrpaeMDocReceivedAuthorityRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    ModalModule.forChild(),
  ],
})
export class PeDrpaeMDocReceivedAuthorityModule {}

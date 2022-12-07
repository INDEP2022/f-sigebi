import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { ModalModule } from 'ngx-bootstrap/modal';

import { DocReceivedAuthorityRoutingModule } from './doc-received-authority-routing.module';
import { DocReceivedAuthorityComponent } from './doc-received-authority/doc-received-authority.component';

@NgModule({
  declarations: [DocReceivedAuthorityComponent],
  imports: [
    CommonModule,
    DocReceivedAuthorityRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    ModalModule.forChild(),
  ],
})
export class DocReceivedAuthorityModule {}

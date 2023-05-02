import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../shared/shared.module';
import { VaultDetailComponent } from './vault-detail/vault-detail.component';
import { VaultListComponent } from './vault-list/vault-list.component';
import { VaultRoutingModule } from './vault-routing.module';

@NgModule({
  declarations: [VaultListComponent, VaultDetailComponent],
  imports: [
    CommonModule,
    VaultRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
  ],
})
export class VaultModule {}

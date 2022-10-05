import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VaultRoutingModule } from './vault-routing.module';
import { VaultListComponent } from './vault-list/vault-list.component';
import { VaultDetailComponent } from './vault-detail/vault-detail.component';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

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

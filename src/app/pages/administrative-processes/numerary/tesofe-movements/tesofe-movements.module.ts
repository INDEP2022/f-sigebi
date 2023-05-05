import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { BanksSharedComponent } from '../../../../@standalone/shared-forms/banks-shared/banks-shared.component';
import { SharedModule } from '../../../../shared/shared.module';
import { TesofeMovementsRoutingModule } from './tesofe-movements-routing.module';
import { TesofeMovementsComponent } from './tesofe-movements/tesofe-movements.component';

import { ModalModule } from 'ngx-bootstrap/modal';
import { CuentasSharedComponent } from 'src/app/@standalone/shared-forms/cuentas-shared/cuentas-shared.component';
import { AccountBanksSharedComponent } from '../../../../@standalone/shared-forms/account-banks-shared/account-banks-shared.component';
import { DelegationSharedComponent } from '../../../../@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { ListBanksComponent } from './list-banks/list-banks.component';
import { TesofeMovementsModalComponent } from './tesofe-movements-modal/tesofe-movements-modal.component';

@NgModule({
  declarations: [
    TesofeMovementsComponent,
    TesofeMovementsModalComponent,
    ListBanksComponent,
  ],
  imports: [
    CommonModule,
    TesofeMovementsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    BanksSharedComponent,
    DelegationSharedComponent,
    CuentasSharedComponent,
    AccountBanksSharedComponent,
    ReactiveFormsModule,
    ModalModule.forChild(),
  ],
})
export class TesofeMovementsModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BanksRoutingModule } from './banks-routing.module';
import { BanksListComponent } from './banks-list/banks-list.component';
import { BanksDetailComponent } from './banks-detail/banks-detail.component';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [BanksListComponent, BanksDetailComponent],
  imports: [
    CommonModule,
    BanksRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
  ],
})
export class BanksModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../shared/shared.module';
import { BanksDetailComponent } from './banks-detail/banks-detail.component';
import { BanksListComponent } from './banks-list/banks-list.component';
import { BanksRoutingModule } from './banks-routing.module';

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

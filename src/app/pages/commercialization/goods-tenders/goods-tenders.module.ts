import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ModalModule } from 'ngx-bootstrap/modal';

import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { GoodsTendersRoutingModule } from './goods-tenders-routing.module';
import { GoodsTendersComponent } from './goods-tenders/goods-tenders.component';

@NgModule({
  declarations: [GoodsTendersComponent],
  imports: [
    CommonModule,
    GoodsTendersRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    ModalModule.forChild(),
  ],
})
export class CLbMGoodsTendersModule {}

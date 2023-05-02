import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { DailyControlReceptionRoutingModule } from './daily-control-reception-routing.module';
import { DailyControlReceptionComponent } from './daily-control-reception/daily-control-reception.component';

@NgModule({
  declarations: [DailyControlReceptionComponent],
  imports: [
    CommonModule,
    DailyControlReceptionRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    ModalModule.forChild(),
  ],
})
export class DailyControlReceptionModule {}

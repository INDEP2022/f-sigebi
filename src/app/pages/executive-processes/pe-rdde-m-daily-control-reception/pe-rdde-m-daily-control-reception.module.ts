import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { PeRddeCDailyControlReceptionComponent } from './pe-rdde-c-daily-control-reception/pe-rdde-c-daily-control-reception.component';
import { PeRddeMDailyControlReceptionRoutingModule } from './pe-rdde-m-daily-control-reception-routing.module';

@NgModule({
  declarations: [PeRddeCDailyControlReceptionComponent],
  imports: [
    CommonModule,
    PeRddeMDailyControlReceptionRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    ModalModule.forChild(),
  ],
})
export class PeRddeMDailyControlReceptionModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';

import { PeRddeMDailyControlReceptionRoutingModule } from './pe-rdde-m-daily-control-reception-routing.module';
import { PeRddeCDailyControlReceptionComponent } from './pe-rdde-c-daily-control-reception/pe-rdde-c-daily-control-reception.component';

@NgModule({
  declarations: [PeRddeCDailyControlReceptionComponent],
  imports: [
    CommonModule,
    PeRddeMDailyControlReceptionRoutingModule,
    SharedModule,
    DelegationSharedComponent,
  ],
})
export class PeRddeMDailyControlReceptionModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProceduralHistoryRoutingModule } from './procedural-history-routing.module';
import { ProceduralHistoryComponent } from './procedural-history/procedural-history.component';

@NgModule({
  declarations: [ProceduralHistoryComponent],
  imports: [
    CommonModule,
    ProceduralHistoryRoutingModule,
    SharedModule,
    DelegationSharedComponent,
  ],
})
export class ProceduralHistoryModule {}

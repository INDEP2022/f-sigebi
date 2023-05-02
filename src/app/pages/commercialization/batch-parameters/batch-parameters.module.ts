import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { BatchParametersListComponent } from './batch-parameters-list/batch-parameters-list.component';
import { BatchParametersRoutingModule } from './batch-parameters-routing.module';
import { EventSelectionComponent } from './components/event-selection/event-selection.component';

@NgModule({
  declarations: [BatchParametersListComponent, EventSelectionComponent],
  imports: [CommonModule, BatchParametersRoutingModule, SharedModule],
  exports: [EventSelectionComponent],
})
export class CMBatchParametersModule {}

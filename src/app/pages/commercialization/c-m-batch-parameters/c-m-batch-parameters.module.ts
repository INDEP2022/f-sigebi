import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { CMBatchParametersListComponent } from './c-m-batch-parameters-list/c-m-batch-parameters-list.component';
import { CMBatchParametersRoutingModule } from './c-m-batch-parameters-routing.module';
import { EventSelectionComponent } from './components/event-selection/event-selection.component';

@NgModule({
  declarations: [CMBatchParametersListComponent, EventSelectionComponent],
  imports: [CommonModule, CMBatchParametersRoutingModule, SharedModule],
})
export class CMBatchParametersModule {}

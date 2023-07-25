import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BatchParametersListComponent } from './batch-parameters-list/batch-parameters-list.component';
import { NewAndUpdateComponent } from './batch-parameters-list/new-and-update/new-and-update.component';
import { BatchParametersRoutingModule } from './batch-parameters-routing.module';
import { EventSelectionComponent } from './components/event-selection/event-selection.component';

@NgModule({
  declarations: [
    BatchParametersListComponent,
    EventSelectionComponent,
    NewAndUpdateComponent,
  ],
  imports: [
    CommonModule,
    BatchParametersRoutingModule,
    SharedModule,
    FormLoaderComponent,
  ],
  exports: [EventSelectionComponent],
})
export class CMBatchParametersModule {}

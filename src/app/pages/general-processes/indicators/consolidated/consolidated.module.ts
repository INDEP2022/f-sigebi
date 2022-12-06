import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { CaptureFilterComponent } from '../components/capture-filter/capture-filter.component';
import { ConsolidatedRoutingModule } from './consolidated-routing.module';
import { ConsolidatedComponent } from './consolidated/consolidated.component';

@NgModule({
  declarations: [ConsolidatedComponent],
  imports: [
    CommonModule,
    ConsolidatedRoutingModule,
    SharedModule,
    CaptureFilterComponent,
  ],
})
export class ConsolidatedModule {}

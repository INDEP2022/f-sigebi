import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { CaptureFilterComponent } from '../components/capture-filter/capture-filter.component';
import { OpinionRoutingModule } from './opinion-routing.module';
import { OpinionComponent } from './opinion/opinion.component';

@NgModule({
  declarations: [OpinionComponent],
  imports: [
    CommonModule,
    OpinionRoutingModule,
    SharedModule,
    CaptureFilterComponent,
  ],
})
export class OpinionModule {}

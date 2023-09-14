import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { CaptureFilterDictComponent } from '../components/capture-filter-dict/capture-filter-dict.component';
import { OpinionRoutingModule } from './opinion-routing.module';
import { OpinionComponent } from './opinion/opinion.component';

@NgModule({
  declarations: [OpinionComponent],
  imports: [
    CommonModule,
    OpinionRoutingModule,
    SharedModule,
    CaptureFilterDictComponent,
  ],
})
export class OpinionModule {}

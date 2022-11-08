import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { GpCaptureFilterComponent } from '../components/gp-capture-filter/gp-capture-filter.component';
import { GpIOpinionRoutingModule } from './gp-i-opinion-routing.module';
import { GpIOpinionComponent } from './gp-i-opinion/gp-i-opinion.component';

@NgModule({
  declarations: [GpIOpinionComponent],
  imports: [
    CommonModule,
    GpIOpinionRoutingModule,
    SharedModule,
    GpCaptureFilterComponent,
  ],
})
export class GpIOpinionModule {}

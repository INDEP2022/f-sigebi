import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { PeAtbCQuarterlyAccumulatedAssetsComponent } from './pe-atb-c-quarterly-accumulated-assets/pe-atb-c-quarterly-accumulated-assets.component';
import { PeAtbMQuarterlyAccumulatedAssetsRoutingModule } from './pe-atb-m-quarterly-accumulated-assets-routing.module';

@NgModule({
  declarations: [PeAtbCQuarterlyAccumulatedAssetsComponent],
  imports: [
    CommonModule,
    PeAtbMQuarterlyAccumulatedAssetsRoutingModule,
    BsDatepickerModule,
    SharedModule,
    DelegationSharedComponent,
  ],
})
export class PeAtbMQuarterlyAccumulatedAssetsModule {}

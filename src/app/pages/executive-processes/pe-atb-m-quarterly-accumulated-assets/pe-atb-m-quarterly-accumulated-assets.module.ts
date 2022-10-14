import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { SharedModule } from 'src/app/shared/shared.module';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';

import { PeAtbMQuarterlyAccumulatedAssetsRoutingModule } from './pe-atb-m-quarterly-accumulated-assets-routing.module';
import { PeAtbCQuarterlyAccumulatedAssetsComponent } from './pe-atb-c-quarterly-accumulated-assets/pe-atb-c-quarterly-accumulated-assets.component';

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

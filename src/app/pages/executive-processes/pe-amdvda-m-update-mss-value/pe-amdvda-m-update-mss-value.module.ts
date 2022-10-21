import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { PeAmdvdaCUpdateMssValueComponent } from './pe-amdvda-c-update-mss-value/pe-amdvda-c-update-mss-value.component';
import { PeAmdvdaMUpdateMssValueRoutingModule } from './pe-amdvda-m-update-mss-value-routing.module';

@NgModule({
  declarations: [PeAmdvdaCUpdateMssValueComponent],
  imports: [CommonModule, PeAmdvdaMUpdateMssValueRoutingModule, SharedModule],
})
export class PeAmdvdaMUpdateMssValueModule {}

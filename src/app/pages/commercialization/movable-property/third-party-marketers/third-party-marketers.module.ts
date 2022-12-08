import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { ThirdPartyMarketersRoutingModule } from './third-party-marketers-routing.module';
import { ThirdPartyMarketersComponent } from './third-party-marketers/third-party-marketers.component';

@NgModule({
  declarations: [ThirdPartyMarketersComponent],
  imports: [CommonModule, ThirdPartyMarketersRoutingModule, SharedModule],
})
export class ThirdPartyMarketersModule {}

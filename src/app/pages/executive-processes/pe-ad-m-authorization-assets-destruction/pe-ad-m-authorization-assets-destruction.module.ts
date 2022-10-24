import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';

import { PeAdCAuthorizationAssetsDestructionComponent } from './pe-ad-c-authorization-assets-destruction/pe-ad-c-authorization-assets-destruction.component';
import { PeAdMAuthorizationAssetsDestructionRoutingModule } from './pe-ad-m-authorization-assets-destruction-routing.module';

@NgModule({
  declarations: [PeAdCAuthorizationAssetsDestructionComponent],
  imports: [
    CommonModule,
    PeAdMAuthorizationAssetsDestructionRoutingModule,
    SharedModule,
    BsDatepickerModule,
  ],
})
export class PeAdMAuthorizationAssetsDestructionModule {}

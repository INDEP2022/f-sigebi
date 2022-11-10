import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { PeAdCAuthorizationAssetsDestructionComponent } from './pe-ad-c-authorization-assets-destruction/pe-ad-c-authorization-assets-destruction.component';
import { PeAdMAuthorizationAssetsDestructionRoutingModule } from './pe-ad-m-authorization-assets-destruction-routing.module';

@NgModule({
  declarations: [PeAdCAuthorizationAssetsDestructionComponent],
  imports: [
    CommonModule,
    PeAdMAuthorizationAssetsDestructionRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class PeAdMAuthorizationAssetsDestructionModule {}

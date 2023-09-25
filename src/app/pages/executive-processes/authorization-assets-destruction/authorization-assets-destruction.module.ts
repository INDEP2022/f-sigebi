import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { ScanFileSharedComponent } from 'src/app/@standalone/shared-forms/scan-file-shared/scan-file-shared.component';
import { AuthorizationAssetsDestructionRoutingModule } from './authorization-assets-destruction-routing.module';
import { AuthorizationAssetsDestructionComponent } from './authorization-assets-destruction/authorization-assets-destruction.component';

@NgModule({
  declarations: [AuthorizationAssetsDestructionComponent],
  imports: [
    CommonModule,
    AuthorizationAssetsDestructionRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    ScanFileSharedComponent,
  ],
})
export class AuthorizationAssetsDestructionModule {}

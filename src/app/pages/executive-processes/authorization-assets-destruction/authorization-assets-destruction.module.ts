import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { AuthorizationAssetsDestructionRoutingModule } from './authorization-assets-destruction-routing.module';
import { AuthorizationAssetsDestructionComponent } from './authorization-assets-destruction/authorization-assets-destruction.component';
import { ModalCorreoComponent } from './utils/modal-correo/modal-correo.component';
import { ScanFileAuthorizationComponent } from './utils/scan-file-shared/scan-file-authorization.component';

@NgModule({
  declarations: [AuthorizationAssetsDestructionComponent, ModalCorreoComponent],
  imports: [
    CommonModule,
    AuthorizationAssetsDestructionRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    ScanFileAuthorizationComponent,
  ],
})
export class AuthorizationAssetsDestructionModule {}

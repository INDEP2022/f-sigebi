import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { DelegationModalComponent } from './delegation-modal/delegation-modal.component';
import { MaintenanceDelegSubdelegModalComponent } from './maintenance-deleg-subdeleg-modal/maintenance-deleg-subdeleg-modal.component';
import { MaintenanceDelegSubdelegRoutingModule } from './maintenance-deleg-subdeleg-routing.module';
import { MaintenanceDelegSubdelegComponent } from './maintenance-deleg-subdeleg/maintenance-deleg-subdeleg.component';

@NgModule({
  declarations: [
    MaintenanceDelegSubdelegComponent,
    MaintenanceDelegSubdelegModalComponent,
    DelegationModalComponent,
  ],
  imports: [
    CommonModule,
    MaintenanceDelegSubdelegRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class MaintenanceDelegSubdelegModule {}

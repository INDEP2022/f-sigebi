import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CPCMaintenanceDelegSubdelegModalComponent } from './c-p-c-maintenance-deleg-subdeleg-modal/c-p-c-maintenance-deleg-subdeleg-modal.component';
import { CPCMaintenanceDelegSubdelegComponent } from './c-p-c-maintenance-deleg-subdeleg/c-p-c-maintenance-deleg-subdeleg.component';
import { CPMMaintenanceDelegSubdelegRoutingModule } from './c-p-m-maintenance-deleg-subdeleg-routing.module';

@NgModule({
  declarations: [
    CPCMaintenanceDelegSubdelegComponent,
    CPCMaintenanceDelegSubdelegModalComponent,
  ],
  imports: [
    CommonModule,
    CPMMaintenanceDelegSubdelegRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CPMMaintenanceDelegSubdelegModule {}

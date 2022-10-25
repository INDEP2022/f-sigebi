import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { StatusClaimsFormComponent } from './status-claims-form/status-claims-form.component';
import { StatusClaimsListComponent } from './status-claims-list/status-claims-list.component';
import { StatusClaimsRoutingModule } from './status-claims-routing.module';

@NgModule({
  declarations: [StatusClaimsListComponent, StatusClaimsFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    StatusClaimsRoutingModule,
  ],
})
export class StatusClaimsModule {}

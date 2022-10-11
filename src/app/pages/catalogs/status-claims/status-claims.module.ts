import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatusClaimsRoutingModule } from './status-claims-routing.module';
import { StatusClaimsListComponent } from './status-claims-list/status-claims-list.component';
import { StatusClaimsFormComponent } from './status-claims-form/status-claims-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    StatusClaimsListComponent,
    StatusClaimsFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    StatusClaimsRoutingModule
  ]
})
export class StatusClaimsModule { }

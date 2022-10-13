import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FdpAdpdtMThirdPossessionActsRoutingModule } from './fdp-adpdt-m-third-possession-acts-routing.module';
import { FdpAdpdtCThirdPossessionActsComponent } from './third-party-possession-acts/fdp-adpdt-c-third-possession-acts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FdpAdpdtDetailDelegationsComponent } from './detail-delegations/fdp-adpdt-detail-delegations.component';

@NgModule({
  declarations: [
    FdpAdpdtCThirdPossessionActsComponent,
    FdpAdpdtDetailDelegationsComponent
  ],
  imports: [
    CommonModule,
    FdpAdpdtMThirdPossessionActsRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class FdpAdpdtMThirdPossessionActsModule { }

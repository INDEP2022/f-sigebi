import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FdpAdpdtMThirdPossessionActsRoutingModule } from './fdp-adpdt-m-third-possession-acts-routing.module';
import { FdpAdpdtCThirdPossessionActsComponent } from './third-party-possession-acts/fdp-adpdt-c-third-possession-acts.component';

@NgModule({
  declarations: [FdpAdpdtCThirdPossessionActsComponent],
  imports: [
    CommonModule,
    FdpAdpdtMThirdPossessionActsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class FdpAdpdtMThirdPossessionActsModule {}

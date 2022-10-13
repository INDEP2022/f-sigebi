import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FdpAddCDestructionActsComponent } from './destruction-acts/fdp-add-c-destruction-acts.component';
import { FdpAddMDestructionActsRoutingModule } from './fdp-add-m-destruction-acts-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [FdpAddCDestructionActsComponent],
  imports: [
    CommonModule,
    FdpAddMDestructionActsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class FdpAddMDestructionActsModule {}

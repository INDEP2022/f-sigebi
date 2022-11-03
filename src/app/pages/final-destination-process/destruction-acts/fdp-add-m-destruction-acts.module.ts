import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { FdpAddCDestructionActsComponent } from './destruction-acts/fdp-add-c-destruction-acts.component';
import { FdpAddMDestructionActsRoutingModule } from './fdp-add-m-destruction-acts-routing.module';
@NgModule({
  declarations: [FdpAddCDestructionActsComponent],
  imports: [
    CommonModule,
    FdpAddMDestructionActsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgScrollbarModule,
  ],
})
export class FdpAddMDestructionActsModule {}

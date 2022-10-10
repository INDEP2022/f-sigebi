import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FdpAddMReturnActsRoutingModule } from './fdp-add-m-return-acts-routing.module';
import { FdpAddCReturnActsComponent } from './return-acts/fdp-add-c-return-acts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FdpAddCReturnActsComponent
  ],
  imports: [
    CommonModule,
    FdpAddMReturnActsRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class FdpAddMReturnActsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FdpAddMDestinationGoodsActsRoutingModule } from './fdp-add-m-destination-goods-acts-routing.module';
import { FdpAddCDestinationGoodsActsComponent } from './destination-acts/fdp-add-c-destination-goods-acts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    FdpAddCDestinationGoodsActsComponent
  ],
  imports: [
    CommonModule,
    FdpAddMDestinationGoodsActsRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class FdpAddMDestinationGoodsActsModule { }

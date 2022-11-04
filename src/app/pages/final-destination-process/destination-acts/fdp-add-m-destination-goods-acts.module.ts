import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { FdpAddCDestinationGoodsActsComponent } from './destination-acts/fdp-add-c-destination-goods-acts.component';
import { FdpAddMDestinationGoodsActsRoutingModule } from './fdp-add-m-destination-goods-acts-routing.module';

@NgModule({
  declarations: [FdpAddCDestinationGoodsActsComponent],
  imports: [
    CommonModule,
    FdpAddMDestinationGoodsActsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgScrollbarModule,
  ],
})
export class FdpAddMDestinationGoodsActsModule {}

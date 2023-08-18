import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomSelectComponent } from 'src/app/@standalone/shared-forms/custom-select/custom-select.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActsGoodsDeliveredRoutingModule } from './acts-goods-delivered-routing.module';
import { ActsGoodsDeliveredComponent } from './acts-goods-delivered/acts-goods-delivered.component';

@NgModule({
  declarations: [ActsGoodsDeliveredComponent],
  imports: [
    CommonModule,
    ActsGoodsDeliveredRoutingModule,
    SharedModule,
    FormsModule,
    CustomSelectComponent,
  ],
})
export class ActsGoodsDeliveredModule {}

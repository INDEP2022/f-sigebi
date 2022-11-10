import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Routing
import { CCGasMGoodsAvailableSaleRoutingModule } from './c-c-gas-m-goods-available-sale-routing.module';
import { CCGasSCStatusComponent } from './status/c-c-gas-s-c-status.component';


@NgModule({
  declarations: [
    CCGasSCStatusComponent
  ],
  imports: [
    CommonModule,
    CCGasMGoodsAvailableSaleRoutingModule,
    SharedModule
  ]
})
export class CCGasMGoodsAvailableSaleModule { }

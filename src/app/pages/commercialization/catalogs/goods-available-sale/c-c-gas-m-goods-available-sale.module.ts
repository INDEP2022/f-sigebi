import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//NGX-Bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Routing
import { CCGasMGoodsAvailableSaleRoutingModule } from './c-c-gas-m-goods-available-sale-routing.module';
import { CCGasSCStatusComponent } from './status/c-c-gas-s-c-status.component';

@NgModule({
  declarations: [CCGasSCStatusComponent],
  imports: [
    CommonModule,
    CCGasMGoodsAvailableSaleRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
  ],
})
export class CCGasMGoodsAvailableSaleModule {}

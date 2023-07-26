import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReceiptGenerationRoutingModule } from './receipt-generation-sami-routing.module';
import { ReceiptGenerationSamiComponent } from './receipt-generation-sami/receipt-generation-sami.component';
import { ReceiptTableGoodsComponent } from './receipt-table-goods/receipt-table-goods.component';

@NgModule({
  declarations: [ReceiptGenerationSamiComponent, ReceiptTableGoodsComponent],
  imports: [CommonModule, ReceiptGenerationRoutingModule, SharedModule],
})
export class ReceiptGenerationSamiModule {}

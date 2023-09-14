import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReceiptGenerationRoutingModule } from './receipt-generation-sami-routing.module';
import { ReceiptGenerationSamiComponent } from './receipt-generation-sami/receipt-generation-sami.component';
import { ReceiptTableGoodsComponent } from './receipt-table-goods/receipt-table-goods.component';
import { ReceiptTableProgramingsComponent } from './receipt-table-programings/receipt-table-programings.component';
import { ReceiptTablesComponent } from './receipt-tables/receipt-tables.component';

@NgModule({
  declarations: [
    ReceiptGenerationSamiComponent,
    ReceiptTableGoodsComponent,
    ReceiptTableProgramingsComponent,
    ReceiptTablesComponent,
  ],
  imports: [CommonModule, ReceiptGenerationRoutingModule, SharedModule],
})
export class ReceiptGenerationSamiModule {}

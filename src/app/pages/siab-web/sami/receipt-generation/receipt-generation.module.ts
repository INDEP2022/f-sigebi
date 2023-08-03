import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ReceiptGenerationRoutingModule } from './receipt-generation-routing.module';
import { ReceiptGenerationComponent } from './receipt-generation/receipt-generation.component';
import { ReceiptTableGoodsComponent } from './receipt-table-goods/receipt-table-goods.component';
import { ReceiptTableProgramingsComponent } from './receipt-table-programings/receipt-table-programings.component';
import { ReceiptTablesComponent } from './receipt-tables/receipt-tables.component';

@NgModule({
  declarations: [
    ReceiptGenerationComponent,
    ReceiptTableGoodsComponent,
    ReceiptTableProgramingsComponent,
    ReceiptTablesComponent,
  ],
  imports: [CommonModule, ReceiptGenerationRoutingModule, SharedModule],
})
export class ReceiptGenerationModule {}

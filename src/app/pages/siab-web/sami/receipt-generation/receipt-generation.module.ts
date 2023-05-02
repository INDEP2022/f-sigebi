import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ReceiptGenerationRoutingModule } from './receipt-generation-routing.module';
import { ReceiptGenerationComponent } from './receipt-generation/receipt-generation.component';

@NgModule({
  declarations: [ReceiptGenerationComponent],
  imports: [CommonModule, ReceiptGenerationRoutingModule, SharedModule],
})
export class ReceiptGenerationModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReceiptGenerationRoutingModule } from './receipt-generation-sami-routing.module';
import { ReceiptGenerationSamiComponent } from './receipt-generation-sami/receipt-generation-sami.component';

@NgModule({
  declarations: [ReceiptGenerationSamiComponent],
  imports: [CommonModule, ReceiptGenerationRoutingModule, SharedModule],
})
export class ReceiptGenerationSamiModule {}

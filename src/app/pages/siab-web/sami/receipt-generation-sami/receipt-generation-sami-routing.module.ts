import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceiptGenerationSamiComponent } from './receipt-generation-sami/receipt-generation-sami.component';

const routes: Routes = [
  {
    path: '',
    component: ReceiptGenerationSamiComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiptGenerationRoutingModule {}

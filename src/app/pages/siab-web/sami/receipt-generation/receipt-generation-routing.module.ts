import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceiptGenerationComponent } from './receipt-generation/receipt-generation.component';

const routes: Routes = [
  {
    path: '',
    component: ReceiptGenerationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiptGenerationRoutingModule {}

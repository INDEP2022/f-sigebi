import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JpDUcmCUnderwritingCreditMemoComponent } from './jp-d-ucm-c-underwriting-credit-memo/jp-d-ucm-c-underwriting-credit-memo.component';

const routes: Routes = [
  {
    path: '',
    component: JpDUcmCUnderwritingCreditMemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JpDMUnderwritingCreditMemoRoutingModule {}

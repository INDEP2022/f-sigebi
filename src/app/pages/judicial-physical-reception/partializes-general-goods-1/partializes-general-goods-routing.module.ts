import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartializesGeneralGoodsComponent } from './partializes-general-goods.component';

const routes: Routes = [
  { path: '', component: PartializesGeneralGoodsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartializesGeneralGoodsRoutingModule {}

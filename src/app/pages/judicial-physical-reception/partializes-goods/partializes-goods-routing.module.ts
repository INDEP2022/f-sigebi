import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartializesGoodsComponent } from './partializes-goods.component';

const routes: Routes = [{ path: '', component: PartializesGoodsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartializesGoodsRoutingModule {}

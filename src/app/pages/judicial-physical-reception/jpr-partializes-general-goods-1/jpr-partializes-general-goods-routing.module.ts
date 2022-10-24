import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JprPartializesGeneralGoodsComponent } from './jpr-partializes-general-goods.component';

const routes: Routes = [{ path: '', component: JprPartializesGeneralGoodsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JprPartializesGeneralGoodsRoutingModule { }

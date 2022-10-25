import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JprPartializesGoodsComponent } from './jpr-partializes-goods.component';

const routes: Routes = [{ path: '', component: JprPartializesGoodsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JprPartializesGoodsRoutingModule { }

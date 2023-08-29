import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OutsideTradesComponent } from './outside-trades/outside-trades.component';

const routes: Routes = [
  {
    path: '',
    component: OutsideTradesComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OutsideTradesRoutingModule {}

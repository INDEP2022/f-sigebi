import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsideTradesComponent } from './inside-trades/inside-trades.component';

const routes: Routes = [
  {
    path: '',
    component: InsideTradesComponent,
  },
];
@NgModule({
  // declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsideTradesRoutingModule {}

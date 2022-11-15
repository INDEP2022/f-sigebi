import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillsGoodComponent } from './bills-good/bills-good.component';

const routes: Routes = [
  {
    path: '',
    component: BillsGoodComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillsGoodRoutingModule {}

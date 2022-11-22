import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CLbCGoodsTendersComponent } from './c-lb-c-goods-tenders/c-lb-c-goods-tenders.component';

const routes: Routes = [
  {
    path: '',
    component: CLbCGoodsTendersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CLbMGoodsTendersRoutingModule {}

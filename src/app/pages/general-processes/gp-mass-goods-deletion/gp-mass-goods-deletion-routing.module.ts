import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpMassGoodsDeletionComponent } from './gp-mass-goods-deletion/gp-mass-goods-deletion.component';

const routes: Routes = [
  {
    path: '',
    component: GpMassGoodsDeletionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpMassGoodsDeletionRoutingModule {}

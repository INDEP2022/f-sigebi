import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MassGoodsDeletionComponent } from './mass-goods-deletion/mass-goods-deletion.component';

const routes: Routes = [
  {
    path: '',
    component: MassGoodsDeletionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MassGoodsDeletionRoutingModule {}

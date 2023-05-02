import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypeOrderServiceListComponent } from './type-order-service-list/type-order-service-list.component';

const routes: Routes = [
  {
    path: '',
    component: TypeOrderServiceListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TypeOrderServiceRoutingModule {}

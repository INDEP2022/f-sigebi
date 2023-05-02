import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypeWharehouseListComponent } from './type-wharehouse-list/type-wharehouse-list.component';

const routes: Routes = [
  {
    path: '',
    component: TypeWharehouseListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TypeWharehouseRoutingModule {}

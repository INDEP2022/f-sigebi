import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodTypesListComponent } from './good-types-list/good-types-list.component';

const routes: Routes = [
  {
    path: '',
    component: GoodTypesListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodTypesRoutingModule {}

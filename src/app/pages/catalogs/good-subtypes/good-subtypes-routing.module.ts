import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodSubtypesListComponent } from './good-subtypes-list/good-subtypes-list.component';

const routes: Routes = [
  {
    path: '',
    component: GoodSubtypesListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodSubtypesRoutingModule {}

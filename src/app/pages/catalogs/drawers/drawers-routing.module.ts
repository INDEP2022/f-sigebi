import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawersListComponent } from './drawers-list/drawers-list.component';

const routes: Routes = [
  {
    path: '',
    component: DrawersListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrawersRoutingModule {}

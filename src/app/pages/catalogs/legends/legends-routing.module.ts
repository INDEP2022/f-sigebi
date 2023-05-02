import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LegendsListComponent } from './legends-list/legends-list.component';

const routes: Routes = [
  {
    path: '',
    component: LegendsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LegendsRoutingModule {}

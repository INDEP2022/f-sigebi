import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NormsListComponent } from './norms-list/norms-list.component';

const routes: Routes = [
  {
    path: '',
    component: NormsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NormsRoutingModule {}

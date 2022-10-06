import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatesListComponent } from './states-list/states-list.component';

const routes: Routes = [
  {
    path: '',
    component: StatesListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatesRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsiderationsListComponent } from './considerations-list/considerations-list.component';

const routes: Routes = [
  {
    path: '',
    component: ConsiderationsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsiderationsRoutingModule {}

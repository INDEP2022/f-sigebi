import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LawyerListComponent } from './lawyer-list/lawyer-list.component';

const routes: Routes = [
  {
    path: '',
    component: LawyerListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LawyerRoutingModule {}

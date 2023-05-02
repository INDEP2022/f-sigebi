import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementsListComponent } from './managements-list/managements-list.component';

const routes: Routes = [
  {
    path: '',
    component: ManagementsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementRoutingModule {}

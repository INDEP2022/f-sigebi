import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsEditComponent } from './reports-edit/reports-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}

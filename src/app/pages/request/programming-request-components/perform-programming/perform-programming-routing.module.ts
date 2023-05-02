import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehouseShowComponent } from '../../shared-request/warehouse-show/warehouse-show.component';
import { PerformProgrammingFormComponent } from './perform-programming-form/perform-programming-form.component';

const routes: Routes = [
  {
    path: '',
    component: PerformProgrammingFormComponent,
  },
  {
    path: 'warehouse/:id',
    component: WarehouseShowComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerformProgrammingRoutingModule {}

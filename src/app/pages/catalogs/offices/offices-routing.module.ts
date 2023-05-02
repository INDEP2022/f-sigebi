import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfficesListComponent } from './offices-list/offices-list.component';

const routes: Routes = [
  {
    path: '',
    component: OfficesListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfficesRoutingModule {}

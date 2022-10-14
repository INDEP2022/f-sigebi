import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypeServicesListComponent } from './type-services-list/type-services-list.component';

const routes: Routes = [
  {
    path: '',
    component: TypeServicesListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TypeServicesRoutingModule {}

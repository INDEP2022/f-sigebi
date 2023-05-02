import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { CustomersPenaltiesComponent } from './customers-penalties/customers-penalties.component';

const routes: Routes = [
  {
    path: '',
    component: CustomersPenaltiesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersPenaltiesRoutingModule {}

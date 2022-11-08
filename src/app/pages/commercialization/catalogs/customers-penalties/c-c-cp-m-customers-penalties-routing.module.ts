import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { CCpCCustomersPenaltiesComponent } from './customers-penalties/c-cp-c-customers-penalties.component';

const routes: Routes = [
  {
    path: '',
    component: CCpCCustomersPenaltiesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CCCpMCustomersPenaltiesRoutingModule {}

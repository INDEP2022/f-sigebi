import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CClCCustomersListComponent } from './customers-list/c-cl-c-customers-list.component';

const routes: Routes = [
  {
    path: '',
    component: CClCCustomersListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CCCMCustomersRoutingModule {}

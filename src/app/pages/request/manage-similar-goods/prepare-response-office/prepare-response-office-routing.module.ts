import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrepareResponseOfficeComponent } from './prepare-response-office/prepare-response-office.component';

const routes: Routes = [
  {
    path: '',
    component: PrepareResponseOfficeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrepareResponseOfficeRoutingModule {}

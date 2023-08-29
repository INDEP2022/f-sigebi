import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormLoadAppraisalsComponent } from './form-load-appraisals/form-load-appraisals.component';

const routes: Routes = [
  {
    path: '',
    component: FormLoadAppraisalsComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormLoadAppraisalsRoutingModule {}

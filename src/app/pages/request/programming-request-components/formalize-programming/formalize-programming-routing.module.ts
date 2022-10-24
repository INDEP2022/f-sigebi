import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormalizeProgrammingFormComponent } from './formalize-programming-form/formalize-programming-form.component';

const routes: Routes = [
  {
    path: '',
    component: FormalizeProgrammingFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormalizeProgrammingRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReturnToPerformProgrammingFormComponent } from './return-to-perform-programming-form/return-to-perform-programming-form.component';

const routes: Routes = [
  {
    path: '',
    component: ReturnToPerformProgrammingFormComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReturnToPerformProgrammingRoutingModule {}

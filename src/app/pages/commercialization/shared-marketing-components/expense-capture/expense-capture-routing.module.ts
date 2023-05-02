import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseCaptureComponent } from './expense-capture/expense-capture.component';

const routes: Routes = [
  {
    path: '',
    component: ExpenseCaptureComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseCaptureRoutingModule {}

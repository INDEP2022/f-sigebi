import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBGeCdgCExpenseCaptureComponent } from './c-b-ge-cdg-c-expense-capture/c-b-ge-cdg-c-expense-capture.component';

const routes: Routes = [
  {
    path: '',
    component: CBGeCdgCExpenseCaptureComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CBGeCdgMExpenseCaptureRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpAcscCCircumstantialActsSuspensionCancellationComponent } from './circumstantial-acts-suspension-cancellation/fdp-acsc-c-circumstantial-acts-suspension-cancellation.component';

const routes: Routes = [
  {
    path: '',
    component: FdpAcscCCircumstantialActsSuspensionCancellationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FdpAcscMCircumstantialActsSuspensionCancellationRoutingModule {}

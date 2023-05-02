import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CircumstantialActsSuspensionCancellationComponent } from './circumstantial-acts-suspension-cancellation/circumstantial-acts-suspension-cancellation.component';

const routes: Routes = [
  {
    path: '',
    component: CircumstantialActsSuspensionCancellationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CircumstantialActsSuspensionCancellationRoutingModule {}

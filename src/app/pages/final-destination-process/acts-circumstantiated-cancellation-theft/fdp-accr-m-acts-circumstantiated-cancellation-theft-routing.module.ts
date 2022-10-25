import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpAccrCActsCircumstantiatedCancellationTheftComponent } from './acts-circumstantiated-cancellation-theft/fdp-accr-c-acts-circumstantiated-cancellation-theft.component';

const routes: Routes = [
  {
    path: '',
    component: FdpAccrCActsCircumstantiatedCancellationTheftComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FdpAccrMActsCircumstantiatedCancellationTheftRoutingModule {}

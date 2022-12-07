import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActsCircumstantiatedCancellationTheftComponent } from './acts-circumstantiated-cancellation-theft/acts-circumstantiated-cancellation-theft.component';

const routes: Routes = [
  {
    path: '',
    component: ActsCircumstantiatedCancellationTheftComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActsCircumstantiatedCancellationTheftRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplyLifComponent } from './apply-lif/apply-lif.component';

const routes: Routes = [
  {
    path: '',
    component: ApplyLifComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplyLifRoutingModule {}

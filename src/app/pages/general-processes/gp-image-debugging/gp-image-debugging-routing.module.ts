import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpImageDebuggingComponent } from './gp-image-debugging/gp-image-debugging.component';

const routes: Routes = [
  {
    path: '',
    component: GpImageDebuggingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpImageDebuggingRoutingModule {}

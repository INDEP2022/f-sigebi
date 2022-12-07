import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpHelpScreenComponent } from './gp-help-screen/gp-help-screen.component';

const routes: Routes = [
  {
    path: '',
    component: GpHelpScreenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpHelpScreenRoutingModule {}

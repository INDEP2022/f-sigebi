import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GreCCompensationActMainComponent } from './gre-c-compensation-act-main/gre-c-compensation-act-main.component';

const routes: Routes = [
  {
    path: ':request',
    component: GreCCompensationActMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GreMCompensationActRoutingModule {}

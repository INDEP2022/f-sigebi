import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompensationActMainComponent } from './compensation-act-main/compensation-act-main.component';

const routes: Routes = [
  {
    path: ':request',
    component: CompensationActMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompensationActRoutingModule {}

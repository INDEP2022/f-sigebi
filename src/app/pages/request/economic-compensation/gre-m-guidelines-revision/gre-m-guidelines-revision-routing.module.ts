import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GreCGuidelinesRevisionMainComponent } from './gre-c-guidelines-revision-main/gre-c-guidelines-revision-main.component';

const routes: Routes = [
  {
    path: ':request',
    component: GreCGuidelinesRevisionMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GreMGuidelinesRevisionRoutingModule {}

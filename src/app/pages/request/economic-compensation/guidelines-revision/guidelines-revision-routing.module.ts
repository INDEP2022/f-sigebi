import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuidelinesRevisionMainComponent } from './guidelines-revision-main/guidelines-revision-main.component';

const routes: Routes = [
  {
    path: ':request',
    component: GuidelinesRevisionMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuidelinesRevisionRoutingModule {}

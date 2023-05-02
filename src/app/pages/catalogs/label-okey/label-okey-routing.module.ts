import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LabelOkeyListComponent } from './label-okey-list/label-okey-list.component';

const routes: Routes = [
  {
    path: '',
    component: LabelOkeyListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabelOkeyRoutingModule {}

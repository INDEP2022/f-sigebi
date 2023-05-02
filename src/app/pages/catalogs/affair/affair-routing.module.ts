import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AffairListComponent } from './affair-list/affair-list.component';

const routes: Routes = [
  {
    path: '',
    component: AffairListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AffairRoutingModule {}

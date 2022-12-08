import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsAssetsDeclaredAbandonedComponent } from './reports-assets-declared-abandoned/reports-assets-declared-abandoned.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsAssetsDeclaredAbandonedComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsAssetsDeclaredAbandonedRoutingModule {}

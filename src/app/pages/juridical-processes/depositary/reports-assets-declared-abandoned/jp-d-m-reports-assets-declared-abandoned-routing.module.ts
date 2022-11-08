import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JpDRadaCReportsAssetsDeclaredAbandonedComponent } from './jp-d-rada-c-reports-assets-declared-abandoned/jp-d-rada-c-reports-assets-declared-abandoned.component';

const routes: Routes = [
  {
    path: '',
    component: JpDRadaCReportsAssetsDeclaredAbandonedComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JpDMReportsAssetsDeclaredAbandonedRoutingModule {}

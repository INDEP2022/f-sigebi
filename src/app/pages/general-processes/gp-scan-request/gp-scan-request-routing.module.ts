import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpScanDocumentsComponent } from './components/gp-scan-documents/gp-scan-documents.component';
import { GpScanRequestComponent } from './gp-scan-request/gp-scan-request.component';

const routes: Routes = [
  {
    path: '',
    component: GpScanRequestComponent,
  },
  {
    path: 'scan',
    component: GpScanDocumentsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpScanRequestRoutingModule {}

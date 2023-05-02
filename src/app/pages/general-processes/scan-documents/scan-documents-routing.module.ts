import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsScanComponent } from './documents-scan/documents-scan.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentsScanComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScanDocumentsRoutingModule {}

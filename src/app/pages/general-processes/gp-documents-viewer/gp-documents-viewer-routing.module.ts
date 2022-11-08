import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpDocumentsViewerComponent } from './gp-documents-viewer/gp-documents-viewer.component';

const routes: Routes = [
  {
    path: '',
    component: GpDocumentsViewerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpDocumentsViewerRoutingModule {}

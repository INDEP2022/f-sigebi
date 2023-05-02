import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsViewerComponent } from './documents-viewer/documents-viewer.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentsViewerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentsViewerRoutingModule {}

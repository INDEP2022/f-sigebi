import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScannedDocumentsComponent } from './scanned-documents/scanned-documents.component';

const routes: Routes = [
  {
    path: '',
    component: ScannedDocumentsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScannedDocumentsRoutingModule {}

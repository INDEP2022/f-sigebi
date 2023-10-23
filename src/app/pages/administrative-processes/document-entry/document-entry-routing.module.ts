import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentEntryComponent } from './document-entry/document-entry.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentEntryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentEntryRoutingModule {}

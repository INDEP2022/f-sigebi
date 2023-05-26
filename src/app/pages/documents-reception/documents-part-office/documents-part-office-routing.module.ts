import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsPartOfficeComponent } from './documents-part-office/documents-part-office.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentsPartOfficeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentsPartOfficeRoutingModule {}

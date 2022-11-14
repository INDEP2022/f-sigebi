import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPMDateDocumentsComponent } from './c-p-m-date-documents/c-p-m-date-documents.component';

const routes: Routes = [
  {
    path: '',
    component: CPMDateDocumentsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMDateDocumentsRoutingModule {}

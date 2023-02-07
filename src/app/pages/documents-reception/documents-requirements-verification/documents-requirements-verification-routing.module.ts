import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsRequirementsVerificationComponent } from './documents-requirements-verification/documents-requirements-verification.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentsRequirementsVerificationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentsRequirementsVerificationRoutingModule {}

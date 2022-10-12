import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrDocumentsRequirementsVerificationComponent } from './dr-documents-requirements-verification/dr-documents-requirements-verification.component';

const routes: Routes = [
  {
    path: '',
    component: DrDocumentsRequirementsVerificationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrDocumentsRequirementsVerificationRoutingModule {}

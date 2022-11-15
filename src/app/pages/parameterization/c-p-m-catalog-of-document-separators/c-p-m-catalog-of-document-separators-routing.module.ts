import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPCdsCCatalogOfDocumentSeparatorsComponent } from './c-p-cds-c-catalog-of-document-separators/c-p-cds-c-catalog-of-document-separators.component';

const routes: Routes = [
  {
    path: '',
    component: CPCdsCCatalogOfDocumentSeparatorsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMCatalogOfDocumentSeparatorsRoutingModule {}

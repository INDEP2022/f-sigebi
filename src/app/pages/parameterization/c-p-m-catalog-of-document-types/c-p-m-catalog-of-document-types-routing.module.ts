import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPCdtCCatalogOfDocumentTypesComponent } from './c-p-cdt-c-catalog-of-document-types/c-p-cdt-c-catalog-of-document-types.component';

const routes: Routes = [
  {
    path: '',
    component: CPCdtCCatalogOfDocumentTypesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMCatalogOfDocumentTypesRoutingModule {}

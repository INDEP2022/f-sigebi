import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogOfDocumentTypesComponent } from './catalog-of-document-types/catalog-of-document-types.component';

const routes: Routes = [
  {
    path: '',
    component: CatalogOfDocumentTypesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogOfDocumentTypesRoutingModule {}

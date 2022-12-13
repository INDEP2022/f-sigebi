import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypesOfClaimsCatalogComponent } from './types-of-claims-catalog/types-of-claims-catalog.component';

const routes: Routes = [
  {
    path: '',
    component: TypesOfClaimsCatalogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TypesOfClaimsCatalogRoutingModule {}

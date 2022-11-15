import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPRcCRateCatalogComponent } from './c-p-rc-c-rate-catalog/c-p-rc-c-rate-catalog.component';

const routes: Routes = [
  {
    path: '',
    component: CPRcCRateCatalogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMRateCatalogRoutingModule {}

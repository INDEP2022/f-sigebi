import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPCtCCatalogOfTransferorsComponent } from './c-p-ct-c-catalog-of-transferors/c-p-ct-c-catalog-of-transferors.component';

const routes: Routes = [
  {
    path: '',
    component: CPCtCCatalogOfTransferorsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMCatalogOfTransferorsRoutingModule {}

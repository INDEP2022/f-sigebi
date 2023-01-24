import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerificationWarehouseAssetsComponent } from './verification-warehouse-assets/verification-warehouse-assets.component';

const routes: Routes = [
  {
    path: '',
    component: VerificationWarehouseAssetsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarehouseVerificationRoutingModule {}

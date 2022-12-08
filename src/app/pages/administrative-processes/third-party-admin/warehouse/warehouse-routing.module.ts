import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegWarehouseContractComponent } from './reg-warehouse-contract/reg-warehouse-contract.component';

const routes: Routes = [
  {
    path: '',
    component: RegWarehouseContractComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarehouseRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaRwcCRegWarehouseContractComponent } from './reg-warehouse-contract/pa-rwc-c-reg-warehouse-contract.component';

const routes: Routes = [
  {
    path: '',
    component: PaRwcCRegWarehouseContractComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaTpWMWarehouseRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CCGasSCStatusComponent } from './status/c-c-gas-s-c-status.component';

const routes: Routes = [
  {
    path: '',
    component: CCGasSCStatusComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CCGasMGoodsAvailableSaleRoutingModule {}

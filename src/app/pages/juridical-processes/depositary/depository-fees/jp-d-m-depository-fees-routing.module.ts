import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JpDDfCDepositoryFeesComponent } from './jp-d-df-c-depository-fees/jp-d-df-c-depository-fees.component';

const routes: Routes = [
  {
    path: '',
    component: JpDDfCDepositoryFeesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JpDMDepositoryFeesRoutingModule {}

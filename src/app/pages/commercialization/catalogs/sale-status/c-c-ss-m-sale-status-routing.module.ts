import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { CCSsCSaleStatusComponent } from './sale-status/c-c-ss-c-sale-status.component';

const routes: Routes = [
  {
    path: '',
    component: CCSsCSaleStatusComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CCSsMSaleStatusRoutingModule {}

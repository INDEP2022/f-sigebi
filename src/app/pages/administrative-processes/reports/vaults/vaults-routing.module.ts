import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VaultsComponent } from './vaults/vaults.component';

const routes: Routes = [
  {
    path: '',
    component: VaultsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VaultsRoutingModule {}

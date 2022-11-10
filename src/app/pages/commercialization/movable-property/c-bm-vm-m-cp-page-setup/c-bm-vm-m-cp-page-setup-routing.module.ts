import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBmVmCCpPageSetupComponent } from './c-bm-vm-c-cp-page-setup/c-bm-vm-c-cp-page-setup.component';

const routes: Routes = [
  {
    path: '',
    component: CBmVmCCpPageSetupComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CBmVmMCpPageSetupRoutingModule {}

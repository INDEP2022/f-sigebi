import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegionalAccountTransferenceComponent } from './regional-account-transference/regional-account-transference.component';

const routes: Routes = [
  {
    path: '',
    component: RegionalAccountTransferenceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegionalAccountTransferenceRoutingModule {}

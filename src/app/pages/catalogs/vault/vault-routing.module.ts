import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VaultListComponent } from './vault-list/vault-list.component';

const routes: Routes = [
  {
    path: '',
    component: VaultListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VaultRoutingModule {}

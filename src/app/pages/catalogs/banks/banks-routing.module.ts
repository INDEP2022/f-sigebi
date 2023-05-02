import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BanksListComponent } from './banks-list/banks-list.component';

const routes: Routes = [
  {
    path: '',
    component: BanksListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BanksRoutingModule {}

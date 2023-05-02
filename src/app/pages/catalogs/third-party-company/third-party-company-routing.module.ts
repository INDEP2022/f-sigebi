import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThirdPartyCompanyListComponent } from './third-party-company-list/third-party-company-list.component';

const routes: Routes = [
  {
    path: '',
    component: ThirdPartyCompanyListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThirdPartyCompanyRoutingModule {}

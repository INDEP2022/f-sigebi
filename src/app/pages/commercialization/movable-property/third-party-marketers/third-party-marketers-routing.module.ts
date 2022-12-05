import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThirdPartyMarketersComponent } from './third-party-marketers/third-party-marketers.component';

const routes: Routes = [
  {
    path: '',
    component: ThirdPartyMarketersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThirdPartyMarketersRoutingModule {}

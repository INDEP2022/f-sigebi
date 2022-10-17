import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBmGeCdcTcCThirdPartyMarketersComponent } from './c-bm-ge-cdc-tc-c-third-party-marketers/c-bm-ge-cdc-tc-c-third-party-marketers.component';

const routes: Routes = [
  {
    path: '',
    component: CBmGeCdcTcCThirdPartyMarketersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CBmGeCdcTcMThirdPartyMarketersRoutingModule {}

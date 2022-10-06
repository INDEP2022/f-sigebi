import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeRddgBreaCAssetsReceivedAdmonComponent } from './pe-rddg-brea-c-assets-received-admon/pe-rddg-brea-c-assets-received-admon.component';

const routes: Routes = [
  {
    path:'',
    component: PeRddgBreaCAssetsReceivedAdmonComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeRddgBreaMAssetsReceivedAdmonRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetsReceivedAdmonComponent } from './assets-received-admon/assets-received-admon.component';

const routes: Routes = [
  {
    path: '',
    component: AssetsReceivedAdmonComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetsReceivedAdmonRoutingModule {}

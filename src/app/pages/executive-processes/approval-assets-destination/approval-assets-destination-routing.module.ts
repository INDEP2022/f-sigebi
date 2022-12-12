import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovalAssetsDestinationComponent } from './approval-assets-destination/approval-assets-destination.component';

const routes: Routes = [
  {
    path: '',
    component: ApprovalAssetsDestinationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApprovalAssetsDestinationRoutingModule {}

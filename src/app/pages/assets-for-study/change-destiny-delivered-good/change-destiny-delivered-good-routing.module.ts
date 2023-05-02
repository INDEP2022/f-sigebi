import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ChangeDestinyDeliveredGoodComponent } from './change-destiny-delivered-good/change-destiny-delivered-good.component';

const routes: Routes = [
  {
    path: '',
    component: ChangeDestinyDeliveredGoodComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
})
export class ChangeDestinyDeliveredGoodRoutingModule {}

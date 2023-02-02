import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { GoodsManagementSocialCabinetComponent } from './goods-management-social-cabinet/goods-management-social-cabinet.component';

const routes: Routes = [
  {
    path: '',
    component: GoodsManagementSocialCabinetComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodsManagementRoutingModule {}

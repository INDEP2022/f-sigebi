import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { PaGmscCGoodsManagementSocialCabinetComponent } from './goods-management-social-cabinet/pa-gmsc-c-goods-management-social-cabinet.component';

const routes: Routes = [
  {
    path: '',
    component: PaGmscCGoodsManagementSocialCabinetComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaGmMGoodsManagementRoutingModule {}

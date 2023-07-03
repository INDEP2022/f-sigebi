import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Routing
import { GoodsManagementRoutingModule } from './goods-management-routing.module';
//Components
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { GoodsManagementSocialCabinetTabComponent } from './goods-management-social-cabinet/goods-management-social-cabinet-tab/goods-management-social-cabinet-tab.component';
import { GoodsManagementSocialCabinetComponent } from './goods-management-social-cabinet/goods-management-social-cabinet.component';
import { GoodsManagementSocialTableErrorsComponent } from './goods-management-social-table-errors/goods-management-social-table-errors.component';
import { GoodsManagementSocialNotLoadGoodsComponent } from './goods-management-social-table/goods-management-social-not-load-goods/goods-management-social-not-load-goods.component';
import { GoodsManagementSocialTable } from './goods-management-social-table/goods-management-social-table.component';

@NgModule({
  declarations: [
    GoodsManagementSocialCabinetComponent,
    GoodsManagementSocialTable,
    GoodsManagementSocialTableErrorsComponent,
    GoodsManagementSocialNotLoadGoodsComponent,
    GoodsManagementSocialCabinetTabComponent,
  ],
  imports: [
    CommonModule,
    GoodsManagementRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    FormLoaderComponent,
    TabsModule,
  ],
})
export class GoodsManagementModule {}

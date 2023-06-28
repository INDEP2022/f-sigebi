import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Routing
import { GoodsManagementRoutingModule } from './goods-management-routing.module';
//Components
import { GoodsManagementSocialCabinetComponent } from './goods-management-social-cabinet/goods-management-social-cabinet.component';
import { GoodsManagementSocialTableErrorsComponent } from './goods-management-social-table-errors/goods-management-social-table-errors.component';
import { GoodsManagementSocialTable } from './goods-management-social-table/goods-management-social-table.component';

@NgModule({
  declarations: [
    GoodsManagementSocialCabinetComponent,
    GoodsManagementSocialTable,
    GoodsManagementSocialTableErrorsComponent,
  ],
  imports: [
    CommonModule,
    GoodsManagementRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class GoodsManagementModule {}

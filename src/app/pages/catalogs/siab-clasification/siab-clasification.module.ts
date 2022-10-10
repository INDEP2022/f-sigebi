import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SiabClasificationRoutingModule } from './siab-clasification-routing.module';
import { SiabClasificationListComponent } from './siab-clasification-list/siab-clasification-list.component';
import { SiabClasificationDetailComponent } from './siab-clasification-detail/siab-clasification-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';

@NgModule({
  declarations: [
    SiabClasificationListComponent,
    SiabClasificationDetailComponent,
  ],
  imports: [
    CommonModule,
    SiabClasificationRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    GoodsTypesSharedComponent,
    ModalModule.forChild(),
  ],
})
export class SiabClasificationModule {}

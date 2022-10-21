import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SiabClasificationDetailComponent } from './siab-clasification-detail/siab-clasification-detail.component';
import { SiabClasificationListComponent } from './siab-clasification-list/siab-clasification-list.component';
import { SiabClasificationRoutingModule } from './siab-clasification-routing.module';

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

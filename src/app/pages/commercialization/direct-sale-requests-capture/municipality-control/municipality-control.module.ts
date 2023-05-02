import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApplicantsModalComponent } from './applicants-modal/applicants-modal.component';
import { AssignedGoodsModalComponent } from './assigned-goods-modal/assigned-goods-modal.component';
import { MunicipalityControlMainComponent } from './municipality-control-main/municipality-control-main.component';
import { MunicipalityControlRoutingModule } from './municipality-control-routing.module';

@NgModule({
  declarations: [
    MunicipalityControlMainComponent,
    ApplicantsModalComponent,
    AssignedGoodsModalComponent,
  ],
  imports: [
    CommonModule,
    MunicipalityControlRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    NgScrollbarModule,
    BsDatepickerModule,
  ],
})
export class MunicipalityControlModule {}

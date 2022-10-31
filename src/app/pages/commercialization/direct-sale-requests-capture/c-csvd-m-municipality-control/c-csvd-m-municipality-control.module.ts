import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { CCsvdCApplicantsModalComponent } from './c-csvd-c-applicants-modal/c-csvd-c-applicants-modal.component';
import { CCsvdCAssignedGoodsModalComponent } from './c-csvd-c-assigned-goods-modal/c-csvd-c-assigned-goods-modal.component';
import { CCsvdCMunicipalityControlMainComponent } from './c-csvd-c-municipality-control-main/c-csvd-c-municipality-control-main.component';
import { CCsvdMMunicipalityControlRoutingModule } from './c-csvd-m-municipality-control-routing.module';

@NgModule({
  declarations: [
    CCsvdCMunicipalityControlMainComponent,
    CCsvdCApplicantsModalComponent,
    CCsvdCAssignedGoodsModalComponent,
  ],
  imports: [
    CommonModule,
    CCsvdMMunicipalityControlRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    NgScrollbarModule,
    BsDatepickerModule,
  ],
})
export class CCsvdMMunicipalityControlModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';

import { SharedModule } from 'src/app/shared/shared.module';
import { CatAppraisersRoutingModule } from './cat-appraisers-routing.module';
import { CatAppraisersComponent } from './cat-appraisers/cat-appraisers.component';
import { ModalCatAppraisersComponent } from './modal-cost-catalog/modal-cat-appraisers.component';

@NgModule({
  declarations: [CatAppraisersComponent, ModalCatAppraisersComponent],
  imports: [
    CommonModule,
    CatAppraisersRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CatAppraisersModule {}

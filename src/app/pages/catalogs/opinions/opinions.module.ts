import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { OpinionFormComponent } from './opinion-form/opinion-form.component';
import { OpinionsListComponent } from './opinions-list/opinions-list.component';
import { OpinionsRoutingModule } from './opinions-routing.module';

@NgModule({
  declarations: [OpinionsListComponent, OpinionFormComponent],
  imports: [
    CommonModule,
    OpinionsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class OpinionsModule {}

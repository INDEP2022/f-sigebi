import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpinionsRoutingModule } from './opinions-routing.module';
import { OpinionsListComponent } from './opinions-list/opinions-list.component';
import { OpinionFormComponent } from './opinion-form/opinion-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

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

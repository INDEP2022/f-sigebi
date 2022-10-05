import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpinionsRoutingModule } from './opinions-routing.module';
import { OpinionsListComponent } from './opinions-list/opinions-list.component';
import { OpinionFormComponent } from './opinion-form/opinion-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { OpinionService } from 'src/app/core/services/catalogs/opinion.service';

@NgModule({
  declarations: [OpinionsListComponent, OpinionFormComponent],
  imports: [
    CommonModule,
    OpinionsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
  providers: [OpinionService],
})
export class OpinionsModule {}

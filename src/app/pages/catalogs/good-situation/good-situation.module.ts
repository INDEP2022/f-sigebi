import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { GoodSituationService } from 'src/app/core/services/catalogs/good-situation.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoodSituationFormComponent } from './good-situation-form/good-situation-form.component';
import { GoodSituationListComponent } from './good-situation-list/good-situation-list.component';
import { GoodSituationRoutingModule } from './good-situation-routing.module';

@NgModule({
  declarations: [GoodSituationListComponent, GoodSituationFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    GoodSituationRoutingModule,
  ],
  providers: [GoodSituationService],
})
export class GoodSituationModule {}

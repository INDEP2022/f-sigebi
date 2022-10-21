import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { PenaltyFormComponent } from './penalty-form/penalty-form.component';
import { PenaltyListComponent } from './penalty-list/penalty-list.component';
import { PenaltyRoutingModule } from './penalty-routing.module';

@NgModule({
  declarations: [PenaltyListComponent, PenaltyFormComponent],
  imports: [
    CommonModule,
    PenaltyRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class PenaltyModule {}

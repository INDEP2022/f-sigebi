import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PenaltyRoutingModule } from './penalty-routing.module';
import { PenaltyListComponent } from './penalty-list/penalty-list.component';
import { PenaltyFormComponent } from './penalty-form/penalty-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    PenaltyListComponent,
    PenaltyFormComponent
  ],
  imports: [
    CommonModule,
    PenaltyRoutingModule,
    SharedModule,
    ModalModule.forChild()
  ]
})
export class PenaltyModule { }

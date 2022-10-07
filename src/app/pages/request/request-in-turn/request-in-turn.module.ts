import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestInTurnRoutingModule } from './request-in-turn-routing.module';
import { RequestInTurnListComponent } from './request-in-turn-list/request-in-turn-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RequestInTurnFormComponent } from './request-in-turn-form/request-in-turn-form.component';
import { BsDatepickerModule, BsDatepickerConfig  } from 'ngx-bootstrap/datepicker';
import { RequestInTurnSelectedComponent } from './request-in-turn-selected/request-in-turn-selected.component';

@NgModule({
  declarations: [
    RequestInTurnListComponent,
    RequestInTurnFormComponent,
    RequestInTurnSelectedComponent
  ],
  imports: [
    CommonModule,
    ModalModule.forChild(),
    SharedModule,
    RequestInTurnRoutingModule,
    BsDatepickerModule.forRoot(),
  ],
  providers: [BsDatepickerConfig]
})
export class RequestInTurnModule { }

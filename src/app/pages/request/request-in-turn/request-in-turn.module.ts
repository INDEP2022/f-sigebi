import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RequestInTurnFormComponent } from './request-in-turn-form/request-in-turn-form.component';
import { RequestInTurnListComponent } from './request-in-turn-list/request-in-turn-list.component';
import { RequestInTurnRoutingModule } from './request-in-turn-routing.module';
import { RequestInTurnSelectedComponent } from './request-in-turn-selected/request-in-turn-selected.component';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    RequestInTurnListComponent,
    RequestInTurnFormComponent,
    RequestInTurnSelectedComponent,
  ],
  imports: [
    CommonModule,
    ModalModule.forChild(),
    SharedModule,
    RequestInTurnRoutingModule,
  ],
})
export class RequestInTurnModule {}

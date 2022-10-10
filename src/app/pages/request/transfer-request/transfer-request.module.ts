import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransferRequestRoutingModule } from './transfer-request-routing.module';
import { CreateRequestComponent } from './create-request/create-request.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UsersSelectedToTurnComponent } from './users-selected-to-turn/users-selected-to-turn.component';

@NgModule({
  declarations: [
    CreateRequestComponent,
    UsersSelectedToTurnComponent
  ],
  imports: [
    CommonModule,
    TransferRequestRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],

})
export class TransferRequestModule { }

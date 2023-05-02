import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StateRepuvesRoutingModule } from './state-repuves-routing.module';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { StateRepuvesFormComponent } from './state-repuves-form/state-repuves-form.component';
import { StateRepuvesListComponent } from './state-repuves-list/state-repuves-list.component';

@NgModule({
  declarations: [StateRepuvesListComponent, StateRepuvesFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    StateRepuvesRoutingModule,
  ],
})
export class StateRepuvesModule {}

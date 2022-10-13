import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StateRepuvesRoutingModule } from './state-repuves-routing.module';

import { StateRepuvesFormComponent } from './state-repuves-form/state-repuves-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
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

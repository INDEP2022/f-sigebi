import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { StateFormComponent } from './state-form/state-form.component';
import { StatesListComponent } from './states-list/states-list.component';
import { StatesRoutingModule } from './states-routing.module';

@NgModule({
  declarations: [StatesListComponent, StateFormComponent],
  imports: [
    CommonModule,
    StatesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class StatesModule {}

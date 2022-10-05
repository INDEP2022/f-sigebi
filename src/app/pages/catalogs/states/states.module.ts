import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatesRoutingModule } from './states-routing.module';
import { StatesListComponent } from './states-list/states-list.component';
import { StateFormComponent } from './state-form/state-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

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

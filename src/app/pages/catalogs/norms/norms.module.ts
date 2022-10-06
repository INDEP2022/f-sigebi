import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { NormsRoutingModule } from './norms-routing.module';
import { NormsFormComponent } from './norms-form/norms-form.component';
import { NormsListComponent } from './norms-list/norms-list.component';


@NgModule({
  declarations: [
    NormsFormComponent,
    NormsListComponent
  ],
  imports: [
    CommonModule,
    NormsRoutingModule,
    SharedModule,
    ModalModule.forChild()
  ]
})
export class NormsModule { }

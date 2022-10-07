import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RackRoutingModule } from './rack-routing.module';
import { RackFormComponent } from './rack-form/rack-form.component';
import { RackListComponent } from './rack-list/rack-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    RackFormComponent,
    RackListComponent
  ],
  imports: [
    CommonModule,
    RackRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ]
})
export class RackModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OriginRoutingModule } from './origin-routing.module';
import { OriginFormComponent } from './origin-form/origin-form.component';
import { OriginListComponent } from './origin-list/origin-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    OriginFormComponent,
    OriginListComponent
  ],
  imports: [
    CommonModule,
    OriginRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ]
})
export class OriginModule { }

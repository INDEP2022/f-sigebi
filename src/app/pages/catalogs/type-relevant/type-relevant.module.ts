import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypeRelevantRoutingModule } from './type-relevant-routing.module';
import { TypeRelevantFormComponent } from './type-relevant-form/type-relevant-form.component';
import { TypeRelevantListComponent } from './type-relevant-list/type-relevant-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    TypeRelevantFormComponent,
    TypeRelevantListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    TypeRelevantRoutingModule
  ]
})
export class TypeRelevantModule { }

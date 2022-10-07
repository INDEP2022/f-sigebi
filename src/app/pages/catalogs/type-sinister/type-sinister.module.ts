import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypeSinisterRoutingModule } from './type-sinister-routing.module';
import { TypeSinisterListComponent } from './type-sinister-list/type-sinister-list.component';
import { TypeSinisterFormComponent } from './type-sinister-form/type-sinister-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    TypeSinisterListComponent,
    TypeSinisterFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    TypeSinisterRoutingModule
  ]
})
export class TypeSinisterModule { }

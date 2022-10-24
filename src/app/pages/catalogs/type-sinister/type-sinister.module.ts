import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { TypeSinisterFormComponent } from './type-sinister-form/type-sinister-form.component';
import { TypeSinisterListComponent } from './type-sinister-list/type-sinister-list.component';
import { TypeSinisterRoutingModule } from './type-sinister-routing.module';

@NgModule({
  declarations: [TypeSinisterListComponent, TypeSinisterFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    TypeSinisterRoutingModule,
  ],
})
export class TypeSinisterModule {}

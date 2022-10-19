import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypeDoctoRoutingModule } from './type-docto-routing.module';
import { TypeDoctoListComponent } from './type-docto-list/type-docto-list.component';
import { TypeDoctoFormComponent } from './type-docto-form/type-docto-form.component';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [TypeDoctoListComponent, TypeDoctoFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    TypeDoctoRoutingModule,
  ],
})
export class TypeDoctoModule {}

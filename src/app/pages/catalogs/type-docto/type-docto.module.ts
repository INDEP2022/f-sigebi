import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TypeDoctoFormComponent } from './type-docto-form/type-docto-form.component';
import { TypeDoctoListComponent } from './type-docto-list/type-docto-list.component';
import { TypeDoctoRoutingModule } from './type-docto-routing.module';

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

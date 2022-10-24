import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { TypeRelevantFormComponent } from './type-relevant-form/type-relevant-form.component';
import { TypeRelevantListComponent } from './type-relevant-list/type-relevant-list.component';
import { TypeRelevantRoutingModule } from './type-relevant-routing.module';

@NgModule({
  declarations: [TypeRelevantFormComponent, TypeRelevantListComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    TypeRelevantRoutingModule,
  ],
})
export class TypeRelevantModule {}

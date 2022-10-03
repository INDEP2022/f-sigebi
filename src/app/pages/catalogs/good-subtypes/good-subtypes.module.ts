import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoodSubtypesRoutingModule } from './good-subtypes-routing.module';
import { GoodSubtypesListComponent } from './good-subtypes-list/good-subtypes-list.component';
import { GoodSubtypeFormComponent } from './good-subtype-form/good-subtype-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [GoodSubtypesListComponent, GoodSubtypeFormComponent],
  imports: [
    CommonModule,
    GoodSubtypesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class GoodSubtypesModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoodSubtypeFormComponent } from './good-subtype-form/good-subtype-form.component';
import { GoodSubtypesListComponent } from './good-subtypes-list/good-subtypes-list.component';
import { GoodSubtypesRoutingModule } from './good-subtypes-routing.module';

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

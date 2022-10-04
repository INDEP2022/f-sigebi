import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoodTypesRoutingModule } from './good-types-routing.module';
import { GoodTypesListComponent } from './good-types-list/good-types-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { GoodTypeFormComponent } from './good-type-form/good-type-form.component';

@NgModule({
  declarations: [GoodTypesListComponent, GoodTypeFormComponent],
  imports: [
    CommonModule,
    GoodTypesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class GoodTypesModule {}

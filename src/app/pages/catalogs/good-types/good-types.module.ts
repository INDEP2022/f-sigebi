import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoodTypeFormComponent } from './good-type-form/good-type-form.component';
import { GoodTypesListComponent } from './good-types-list/good-types-list.component';
import { GoodTypesRoutingModule } from './good-types-routing.module';

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

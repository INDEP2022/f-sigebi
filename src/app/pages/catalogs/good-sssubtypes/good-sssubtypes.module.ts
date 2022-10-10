import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoodSssubtypesRoutingModule } from './good-sssubtypes-routing.module';
import { GoodSssubtypesListComponent } from './good-sssubtypes-list/good-sssubtypes-list.component';
import { GoodSssubtypesFormComponent } from './good-sssubtypes-form/good-sssubtypes-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [GoodSssubtypesListComponent, GoodSssubtypesFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    GoodSssubtypesRoutingModule,
  ],
})
export class GoodSssubtypesModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoodSssubtypesFormComponent } from './good-sssubtypes-form/good-sssubtypes-form.component';
import { GoodSssubtypesListComponent } from './good-sssubtypes-list/good-sssubtypes-list.component';
import { GoodSssubtypesRoutingModule } from './good-sssubtypes-routing.module';

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

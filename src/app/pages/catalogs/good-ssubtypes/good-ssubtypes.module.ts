import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoodSsubtypesFormComponent } from './good-ssubtypes-form/good-ssubtypes-form.component';
import { GoodSsubtypesListComponent } from './good-ssubtypes-list/good-ssubtypes-list.component';
import { GoodSsubtypesRoutingModule } from './good-ssubtypes-routing.module';

@NgModule({
  declarations: [GoodSsubtypesListComponent, GoodSsubtypesFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    GoodSsubtypesRoutingModule,
  ],
})
export class GoodSsubtypesModule {}

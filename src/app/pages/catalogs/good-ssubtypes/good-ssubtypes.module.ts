import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoodSsubtypesRoutingModule } from './good-ssubtypes-routing.module';
import { GoodSsubtypesListComponent } from './good-ssubtypes-list/good-ssubtypes-list.component';
import { GoodSsubtypesFormComponent } from './good-ssubtypes-form/good-ssubtypes-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

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

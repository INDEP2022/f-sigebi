import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { OfficeFormComponent } from './office-form/office-form.component';
import { OfficesListComponent } from './offices-list/offices-list.component';
import { OfficesRoutingModule } from './offices-routing.module';

@NgModule({
  declarations: [OfficeFormComponent, OfficesListComponent],
  imports: [
    CommonModule,
    OfficesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class OfficesModule {}

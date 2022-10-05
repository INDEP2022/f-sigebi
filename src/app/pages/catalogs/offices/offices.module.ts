import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficesRoutingModule } from './offices-routing.module';
import { OfficeFormComponent } from './office-form/office-form.component';
import { OfficesListComponent } from './offices-list/offices-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { OfficeService } from 'src/app/core/services/catalogs/office.service';

@NgModule({
  declarations: [OfficeFormComponent, OfficesListComponent],
  imports: [
    CommonModule,
    OfficesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
  providers: [OfficeService],
})
export class OfficesModule {}

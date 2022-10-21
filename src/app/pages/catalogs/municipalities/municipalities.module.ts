import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { MunicipalitiesRoutingModule } from './municipalities-routing.module';
import { MunicipalityFormComponent } from './municipality-form/municipality-form.component';
import { MunicipalityListComponent } from './municipality-list/municipality-list.component';

@NgModule({
  declarations: [MunicipalityFormComponent, MunicipalityListComponent],
  imports: [
    CommonModule,
    MunicipalitiesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class MunicipalitiesModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { RegulationFormComponent } from './regulation-form/regulation-form.component';
import { RegulationsListComponent } from './regulations-list/regulations-list.component';
import { RegulationsRoutingModule } from './regulations-routing.module';

@NgModule({
  declarations: [RegulationsListComponent, RegulationFormComponent],
  imports: [
    CommonModule,
    RegulationsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class RegulationsModule {}

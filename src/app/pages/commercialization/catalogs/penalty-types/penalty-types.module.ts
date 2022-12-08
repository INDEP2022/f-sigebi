import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { PenaltyTypesFormComponent } from './penalty-types-form/penalty-types-form.component';
import { PenaltyTypesListComponent } from './penalty-types-list/penalty-types-list.component';
import { PenaltyTypesRoutingModule } from './penalty-types-routing.module';

@NgModule({
  declarations: [PenaltyTypesFormComponent, PenaltyTypesListComponent],
  imports: [
    CommonModule,
    PenaltyTypesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class PenaltyTypesModule {}

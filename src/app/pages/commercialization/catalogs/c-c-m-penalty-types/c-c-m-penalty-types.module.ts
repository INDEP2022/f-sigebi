import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CCMPenaltyTypesRoutingModule } from './c-c-m-penalty-types-routing.module';
import { CCTpCPenaltyTypesFormComponent } from './c-c-tp-c-penalty-types-form/c-c-tp-c-penalty-types-form.component';
import { CCTpCPenaltyTypesListComponent } from './c-c-tp-c-penalty-types-list/c-c-tp-c-penalty-types-list.component';

@NgModule({
  declarations: [
    CCTpCPenaltyTypesFormComponent,
    CCTpCPenaltyTypesListComponent,
  ],
  imports: [
    CommonModule,
    CCMPenaltyTypesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CCMPenaltyTypesModule {}

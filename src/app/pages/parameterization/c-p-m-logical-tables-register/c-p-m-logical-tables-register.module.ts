import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { CPCLogicalTablesRegisterModalComponent } from './c-p-c-logical-tables-register-modal/c-p-c-logical-tables-register-modal.component';
import { CPCLogicalTablesRegisterComponent } from './c-p-c-logical-tables-register/c-p-c-logical-tables-register.component';
import { CPMLogicalTablesRegisterRoutingModule } from './c-p-m-logical-tables-register-routing.module';

@NgModule({
  declarations: [
    CPCLogicalTablesRegisterComponent,
    CPCLogicalTablesRegisterModalComponent,
  ],
  imports: [
    CommonModule,
    CPMLogicalTablesRegisterRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CPMLogicalTablesRegisterModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { LogicalTablesRegisterModalComponent } from './logical-tables-register-modal/logical-tables-register-modal.component';
import { LogicalTablesRegisterRoutingModule } from './logical-tables-register-routing.module';
import { LogicalTablesRegisterComponent } from './logical-tables-register/logical-tables-register.component';

@NgModule({
  declarations: [
    LogicalTablesRegisterComponent,
    LogicalTablesRegisterModalComponent,
  ],
  imports: [
    CommonModule,
    LogicalTablesRegisterRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class LogicalTablesRegisterModule {}

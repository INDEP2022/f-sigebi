import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CPCRegisterKeysLogicalTablesComponent } from './c-p-c-register-keys-logical-tables/c-p-c-register-keys-logical-tables.component';
import { CPMRegisterKeysLogicalTablesModalComponent } from './c-p-m-register-keys-logical-tables-modal/c-p-m-register-keys-logical-tables-modal.component';
import { CPMRegisterKeysLogicalTablesRoutingModule } from './c-p-m-register-keys-logical-tables-routing.module';

@NgModule({
  declarations: [
    CPCRegisterKeysLogicalTablesComponent,
    CPMRegisterKeysLogicalTablesModalComponent,
  ],
  imports: [
    CommonModule,
    CPMRegisterKeysLogicalTablesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CPMRegisterKeysLogicalTablesModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { RegisterKeyOneModalComponent } from './register-key-one-modal/register-key-one-modal.component';
import { RegisterKeysLogicalTablesModalComponent } from './register-keys-logical-tables-modal/register-keys-logical-tables-modal.component';
import { RegisterKeysLogicalTablesRoutingModule } from './register-keys-logical-tables-routing.module';
import { RegisterKeysLogicalTablesComponent } from './register-keys-logical-tables/register-keys-logical-tables.component';

@NgModule({
  declarations: [
    RegisterKeysLogicalTablesComponent,
    RegisterKeysLogicalTablesModalComponent,
    RegisterKeyOneModalComponent,
  ],
  imports: [
    CommonModule,
    RegisterKeysLogicalTablesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class RegisterKeysLogicalTablesModule {}

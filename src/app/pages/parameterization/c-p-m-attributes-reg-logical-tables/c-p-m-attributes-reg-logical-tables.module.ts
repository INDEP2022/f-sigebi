import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CPCAttributesRegLogicalTablesModalComponent } from './c-p-c-attributes-reg-logical-tables-modal/c-p-c-attributes-reg-logical-tables-modal.component';
import { CPCAttributesRegLogicalTablesComponent } from './c-p-c-attributes-reg-logical-tables/c-p-c-attributes-reg-logical-tables.component';
import { CPMAttributesRegLogicalTablesRoutingModule } from './c-p-m-attributes-reg-logical-tables-routing.module';

@NgModule({
  declarations: [
    CPCAttributesRegLogicalTablesComponent,
    CPCAttributesRegLogicalTablesModalComponent,
  ],
  imports: [
    CommonModule,
    CPMAttributesRegLogicalTablesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CPMAttributesRegLogicalTablesModule {}

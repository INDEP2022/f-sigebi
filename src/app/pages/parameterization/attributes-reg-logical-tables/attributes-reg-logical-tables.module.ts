import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { AttributesRegLogicalTablesModalComponent } from './attributes-reg-logical-tables-modal/attributes-reg-logical-tables-modal.component';
import { ttributesRegLogicalTablesRoutingModule } from './attributes-reg-logical-tables-routing.module';
import { AttributesRegLogicalTablesComponent } from './attributes-reg-logical-tables/attributes-reg-logical-tables.component';

@NgModule({
  declarations: [
    AttributesRegLogicalTablesComponent,
    AttributesRegLogicalTablesModalComponent,
  ],
  imports: [
    CommonModule,
    ttributesRegLogicalTablesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class ttributesRegLogicalTablesModule {}

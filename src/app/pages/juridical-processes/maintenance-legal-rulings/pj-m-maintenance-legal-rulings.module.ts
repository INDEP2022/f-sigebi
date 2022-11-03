/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJMaintenanceLegalRulingRoutingModule } from './pj-m-maintenance-legal-rulings-routing.module';

/** COMPONENTS IMPORTS */
import { PJMaintenanceLegalRulingCopyDocumentationGoodsComponent } from './maintenance-legal-rulings/copy-documentation-goods/pj-c-maintenance-legal-rulings-copy-documentation-goods.component';
import { PJMaintenanceLegalRulingDocumentTradeComponent } from './maintenance-legal-rulings/document-trade/pj-c-maintenance-legal-rulings-document-trade.component';
import { PJMaintenanceLegalRulingDocumentationGoodsComponent } from './maintenance-legal-rulings/documentation-goods/pj-c-maintenance-legal-rulings-documentation-goods.component';
import { PJMaintenanceLegalRulingGoodsComponent } from './maintenance-legal-rulings/goods/pj-c-maintenance-legal-rulings-goods.component';
import { PJMaintenanceLegalRulingMoreInformationComponent } from './maintenance-legal-rulings/more-information/pj-c-maintenance-legal-rulings-more-information.component';
import { PJMaintenanceLegalRulingComponent } from './maintenance-legal-rulings/pj-c-maintenance-legal-rulings.component';
import { PJMaintenanceLegalRulingRulingsComponent } from './maintenance-legal-rulings/rulings/pj-c-maintenance-legal-rulings-rulings.component';

@NgModule({
  declarations: [
    PJMaintenanceLegalRulingComponent,
    PJMaintenanceLegalRulingRulingsComponent,
    PJMaintenanceLegalRulingMoreInformationComponent,
    PJMaintenanceLegalRulingGoodsComponent,
    PJMaintenanceLegalRulingDocumentationGoodsComponent,
    PJMaintenanceLegalRulingDocumentTradeComponent,
    PJMaintenanceLegalRulingCopyDocumentationGoodsComponent,
  ],
  imports: [CommonModule, PJMaintenanceLegalRulingRoutingModule, SharedModule],
})
export class PJMaintenanceLegalRulingModule {}

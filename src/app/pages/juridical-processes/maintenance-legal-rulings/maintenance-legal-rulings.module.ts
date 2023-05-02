/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { MaintenanceLegalRulingRoutingModule } from './maintenance-legal-rulings-routing.module';

/** COMPONENTS IMPORTS */
import { CopyDocumentationGoodsComponent } from './maintenance-legal-rulings/copy-documentation-goods/copy-documentation-goods.component';
import { CopyDocumentationGoodsDialogComponent } from './maintenance-legal-rulings/dialogs/copy-documentation-goods-dialog/copy-documentation-goods-dialog.component';
import { DocumentationGoodsDialogComponent } from './maintenance-legal-rulings/dialogs/documentation-goods-dialog/documentation-goods-dialog.component';
import { GoodsDialogComponent } from './maintenance-legal-rulings/dialogs/goods-dialog/goods-dialog.component';
import { DocumentTradeComponent } from './maintenance-legal-rulings/document-trade/document-trade.component';
import { DocumentationGoodsComponent } from './maintenance-legal-rulings/documentation-goods/documentation-goods.component';
import { GoodsComponent } from './maintenance-legal-rulings/goods/goods.component';
import { MaintenanceLegalRulingComponent } from './maintenance-legal-rulings/maintenance-legal-rulings.component';
import { MoreInformationComponent } from './maintenance-legal-rulings/more-information/more-information.component';
import { RulingsComponent } from './maintenance-legal-rulings/rulings/rulings.component';

@NgModule({
  declarations: [
    MaintenanceLegalRulingComponent,
    RulingsComponent,
    MoreInformationComponent,
    GoodsComponent,
    DocumentationGoodsComponent,
    DocumentTradeComponent,
    CopyDocumentationGoodsComponent,
    DocumentationGoodsDialogComponent,
    GoodsDialogComponent,
    CopyDocumentationGoodsDialogComponent,
  ],
  imports: [CommonModule, MaintenanceLegalRulingRoutingModule, SharedModule],
})
export class MaintenanceLegalRulingModule {}

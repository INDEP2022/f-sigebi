/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedLegalProcessModule } from '../shared-legal-process/shared-legal-process.module';

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJAAbandonmentsDeclarationTradesRoutingModule } from './pj-a-m-abandonments-declaration-trades-routing.module';

/** COMPONENTS IMPORTS */
import { PJAAbandonmentsDeclarationTradesComponent } from './abandonments-declaration-trades/pj-a-c-abandonments-declaration-trades.component';

@NgModule({
  declarations: [PJAAbandonmentsDeclarationTradesComponent],
  imports: [
    CommonModule,
    PJAAbandonmentsDeclarationTradesRoutingModule,
    SharedModule,
    SharedLegalProcessModule,
    TabsModule,
  ],
})
export class PJAAbandonmentsDeclarationTradesModule {}

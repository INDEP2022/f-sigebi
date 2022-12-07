/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedJuridicalProcessesModule } from '../shared-juridical-processes/shared-juridical-processes.module';

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { AbandonmentsDeclarationTradesRoutingModule } from './abandonments-declaration-trades-routing.module';

/** COMPONENTS IMPORTS */
import { AbandonmentsDeclarationTradesComponent } from './abandonments-declaration-trades/abandonments-declaration-trades.component';

@NgModule({
  declarations: [AbandonmentsDeclarationTradesComponent],
  imports: [
    CommonModule,
    AbandonmentsDeclarationTradesRoutingModule,
    SharedModule,
    SharedJuridicalProcessesModule,
    TabsModule,
  ],
})
export class AbandonmentsDeclarationTradesModule {}

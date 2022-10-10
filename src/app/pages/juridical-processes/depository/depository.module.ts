/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { DepositoryRoutingModule } from './depository-routing.module';

/** COMPONENTS IMPORTS */

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DepositoryRoutingModule,
    SharedModule,
  ],
})
export class DepositoryModule {}

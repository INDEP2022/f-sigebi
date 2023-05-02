/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { DeclarationAbandonmentInsuranceRoutingModule } from './declaration-abandonment-insurance-routing.module';

/** COMPONENTS IMPORTS */
import { DeclarationAbandonmentInsuranceComponent } from './declaration-abandonment-insurance/declaration-abandonment-insurance.component';

@NgModule({
  declarations: [DeclarationAbandonmentInsuranceComponent],
  imports: [
    CommonModule,
    DeclarationAbandonmentInsuranceRoutingModule,
    SharedModule,
  ],
})
export class DeclarationAbandonmentInsuranceModule {}

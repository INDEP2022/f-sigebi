/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJDeclarationAbandonmentInsuranceRoutingModule } from './pj-m-declaration-abandonment-insurance-routing.module';

/** COMPONENTS IMPORTS */
import { PJDeclarationAbandonmentInsuranceComponent } from './declaration-abandonment-insurance/pj-c-declaration-abandonment-insurance.component';

@NgModule({
  declarations: [PJDeclarationAbandonmentInsuranceComponent],
  imports: [
    CommonModule,
    PJDeclarationAbandonmentInsuranceRoutingModule,
    SharedModule,
  ],
})
export class PJDeclarationAbandonmentInsuranceModule {}

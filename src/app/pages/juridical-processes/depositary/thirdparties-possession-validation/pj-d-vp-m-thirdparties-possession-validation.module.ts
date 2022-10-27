/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJDVPThirdpartiesPossessionValidationRoutingModule } from './pj-d-vp-m-thirdparties-possession-validation-routing.module';

/** COMPONENTS IMPORTS */
import { PJDVPThirdpartiesPossessionValidationComponent } from './thirdparties-possession-validation/pj-d-vp-c-thirdparties-possession-validation.component';

@NgModule({
  declarations: [PJDVPThirdpartiesPossessionValidationComponent],
  imports: [
    CommonModule,
    PJDVPThirdpartiesPossessionValidationRoutingModule,
    SharedModule,
  ],
})
export class PJDVPThirdpartiesPossessionValidationModule {}

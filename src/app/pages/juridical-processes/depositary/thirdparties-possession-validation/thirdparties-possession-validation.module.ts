/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { ThirdpartiesPossessionValidationRoutingModule } from './thirdparties-possession-validation-routing.module';

/** COMPONENTS IMPORTS */
import { ThirdpartiesPossessionValidationComponent } from './thirdparties-possession-validation/thirdparties-possession-validation.component';

@NgModule({
  declarations: [ThirdpartiesPossessionValidationComponent],
  imports: [
    CommonModule,
    ThirdpartiesPossessionValidationRoutingModule,
    SharedModule,
  ],
})
export class ThirdpartiesPossessionValidationModule {}

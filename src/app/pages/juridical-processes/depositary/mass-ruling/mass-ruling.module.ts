/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { MassRulingRoutingModule } from './mass-ruling-routing.module';

/** COMPONENTS IMPORTS */
import { CustomSelectComponent } from 'src/app/@standalone/shared-forms/custom-select/custom-select.component';
import { MassRulingModalComponent } from './mass-ruling-modal/mass-ruling-modal.component';
import { MassRulingComponent } from './mass-ruling/mass-ruling.component';

@NgModule({
  declarations: [MassRulingComponent, MassRulingModalComponent],
  imports: [
    CommonModule,
    MassRulingRoutingModule,
    SharedModule,
    CustomSelectComponent,
  ],
})
export class MassRulingModule {}

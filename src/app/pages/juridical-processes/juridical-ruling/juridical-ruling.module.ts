/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { JuridicalRulingRoutingModule } from './juridical-ruling-routing.module';

/** COMPONENTS IMPORTS */
import { EditDocumentsModalComponent } from './edit-documents-modal/edit-documents-modal.component';
import { JuridicalRulingComponent } from './juridical-ruling/juridical-ruling.component';
import { RDictaminaDocModalComponent } from './r-dictamina-doc-modal/r-dictamina-doc-modal.component';

@NgModule({
  declarations: [
    JuridicalRulingComponent,
    RDictaminaDocModalComponent,
    EditDocumentsModalComponent,
  ],
  imports: [CommonModule, JuridicalRulingRoutingModule, SharedModule],
  exports: [JuridicalRulingComponent],
})
export class JuridicalRulingModule {}

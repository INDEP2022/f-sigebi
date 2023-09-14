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
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { EditDocumentsModalComponent } from './edit-documents-modal/edit-documents-modal.component';
import { JuridicalRulingComponent } from './juridical-ruling/juridical-ruling.component';
import { ListdictumsComponent } from './listdictums/listdictums.component';
import { RDictaminaDocModalComponent } from './r-dictamina-doc-modal/r-dictamina-doc-modal.component';

@NgModule({
  declarations: [
    JuridicalRulingComponent,
    RDictaminaDocModalComponent,
    EditDocumentsModalComponent,
    ListdictumsComponent,
  ],
  imports: [
    CommonModule,
    JuridicalRulingRoutingModule,
    SharedModule,
    TooltipModule.forRoot(),
    FormLoaderComponent,
  ],
  exports: [JuridicalRulingComponent],
})
export class JuridicalRulingModule {}

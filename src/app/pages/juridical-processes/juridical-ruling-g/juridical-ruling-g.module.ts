/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClassificationTypeSsubtypeOfGoodsSharedComponent } from 'src/app/@standalone/shared-forms/classification-type-ssubtype-of-goods-shared copy/classification-type-ssubtype-of-goods-shared';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { JuridicalRulingGRoutingModule } from './juridical-ruling-g-routing.module';

/** COMPONENTS IMPORTS */
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { EditDocumentsModalComponent } from './edit-documents-modal/edit-documents-modal.component';
import { JuridicalRulingGComponent } from './juridical-ruling-g/juridical-ruling-g.component';
import { ListdictumsComponent } from './juridical-ruling-g/listdictums/listdictums.component';
import { RDictaminaDocModalComponent } from './r-dictamina-doc-modal/r-dictamina-doc-modal.component';

@NgModule({
  declarations: [
    JuridicalRulingGComponent,
    RDictaminaDocModalComponent,
    EditDocumentsModalComponent,
    ListdictumsComponent,
  ],
  imports: [
    CommonModule,
    JuridicalRulingGRoutingModule,
    SharedModule,
    UsersSharedComponent,
    ClassificationTypeSsubtypeOfGoodsSharedComponent,
    TooltipModule.forRoot(),
    FormLoaderComponent,
  ],
  exports: [JuridicalRulingGComponent],
})
export class JuridicalRulingGModule {}

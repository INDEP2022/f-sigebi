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
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { FileDataUpdateModule } from '../file-data-update/file-data-update.module';
import { FormSearchHandlerModule } from '../shared/form-search-handler/form-search-handler.module';
import { AbandonmentsDeclarationTradesComponent } from './abandonments-declaration-trades/abandonments-declaration-trades.component';
import { AddCopyComponent } from './abandonments-declaration-trades/add-copy/add-copy.component';
import { DocsComponent } from './abandonments-declaration-trades/docs/docs.component';
import { EditTextComponent } from './abandonments-declaration-trades/edit-text/edit-text.component';
import { ListdictumsComponent } from './abandonments-declaration-trades/listdictums/listdictums.component';
import { ListoficiosComponent } from './abandonments-declaration-trades/listoficios/listoficios.component';
import { UpdateCopyComponent } from './abandonments-declaration-trades/update-copy/update-copy.component';

@NgModule({
  declarations: [
    AbandonmentsDeclarationTradesComponent,
    EditTextComponent,
    DocsComponent,
    ListdictumsComponent,
    ListoficiosComponent,
    AddCopyComponent,
    UpdateCopyComponent,
  ],
  imports: [
    CommonModule,
    AbandonmentsDeclarationTradesRoutingModule,
    SharedModule,
    SharedJuridicalProcessesModule,
    TabsModule,
    FileDataUpdateModule,
    FormSearchHandlerModule,
    FormLoaderComponent,
    TooltipModule.forRoot(),
  ],
})
export class AbandonmentsDeclarationTradesModule {}

/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { FileDataUpdateRoutingModule } from './file-data-update-routing.module';

/** COMPONENTS IMPORTS */
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { FormSearchHandlerModule } from '../shared/form-search-handler/form-search-handler.module';
import { FileDataUpdateComponent } from './file-data-update/file-data-update.component';
import { AddEditFlyerCopyComponent } from './flyer-copies-modal/add-edit-flyer-copy/add-edit-flyer-copy.component';
import { FlyerCopiesModalComponent } from './flyer-copies-modal/flyer-copies-modal.component';
import { JuridicalRecordUpdateComponent } from './shared/juridical-record-update/juridical-record-update.component';

@NgModule({
  declarations: [
    FileDataUpdateComponent,
    JuridicalRecordUpdateComponent,
    FlyerCopiesModalComponent,
    AddEditFlyerCopyComponent,
  ],
  imports: [
    CommonModule,
    FileDataUpdateRoutingModule,
    SharedModule,
    FormSearchHandlerModule,
    FormLoaderComponent,
  ],
  exports: [FileDataUpdateComponent, JuridicalRecordUpdateComponent],
})
export class FileDataUpdateModule {}

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
import { FileDataUpdateComponent } from './file-data-update/file-data-update.component';
import { JuridicalRecordUpdateComponent } from './shared/juridical-record-update/juridical-record-update.component';

@NgModule({
  declarations: [FileDataUpdateComponent, JuridicalRecordUpdateComponent],
  imports: [CommonModule, FileDataUpdateRoutingModule, SharedModule],
  exports: [FileDataUpdateComponent, JuridicalRecordUpdateComponent],
})
export class FileDataUpdateModule {}

/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJDGAFGenerationFilesTradesRoutingModule } from './pj-d-gaf-m-generation-files-trades-routing.module';

/** COMPONENTS IMPORTS */
import { PJDGAFGenerationFilesTradesComponent } from './generation-files-trades/pj-d-gaf-c-generation-files-trades.component';

@NgModule({
  declarations: [PJDGAFGenerationFilesTradesComponent],
  imports: [
    CommonModule,
    PJDGAFGenerationFilesTradesRoutingModule,
    SharedModule,
  ],
})
export class PJDGAFGenerationFilesTradesModule {}

/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { GenerationFilesTradesRoutingModule } from './generation-files-trades-routing.module';

/** COMPONENTS IMPORTS */
import { GenerationFilesTradesComponent } from './generation-files-trades/generation-files-trades.component';

@NgModule({
  declarations: [GenerationFilesTradesComponent],
  imports: [CommonModule, GenerationFilesTradesRoutingModule, SharedModule],
})
export class GenerationFilesTradesModule {}

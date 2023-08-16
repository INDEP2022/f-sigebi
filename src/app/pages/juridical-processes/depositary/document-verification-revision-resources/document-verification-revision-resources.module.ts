/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { DocumentVerificationRevisionResourcesRoutingModule } from './document-verification-revision-resources-routing.module';

/** COMPONENTS IMPORTS */
import { ExpedientSharedComponent } from 'src/app/@standalone/shared-forms/expedient-shared/expedient-shared.component';
import { HistoricalSituationGoodsModule } from '../historical-situation-goods/historical-situation-goods.module';
import { DocumentVerificationRevisionResourcesComponent } from './document-verification-revision-resources/document-verification-revision-resources.component';
import { FindAllExpedientComponent } from './find-all-expedient/find-all-expedient.component';
import { FindAllGoodComponent } from './find-all-good/find-all-good.component';

@NgModule({
  declarations: [
    DocumentVerificationRevisionResourcesComponent,
    FindAllExpedientComponent,
    FindAllGoodComponent,
  ],
  imports: [
    CommonModule,
    DocumentVerificationRevisionResourcesRoutingModule,
    ExpedientSharedComponent,
    SharedModule,
    HistoricalSituationGoodsModule,
    FormLoaderComponent,
  ],
})
export class DocumentVerificationRevisionResourcesModule {}

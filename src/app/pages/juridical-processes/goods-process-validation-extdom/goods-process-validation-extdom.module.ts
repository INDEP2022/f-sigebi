/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { GoodsProcessValidationExtdomRoutingModule } from './goods-process-validation-extdom-routing.module';

/** COMPONENTS IMPORTS */
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { EmailGoodProcessValidationComponent } from './email/email.component';
import { GoodsProcessValidationExtdomComponent } from './goods-process-validation-extdom/goods-process-validation-extdom.component';
import { HistoricalGoodsExtDomComponent } from './historical-goods-extdom/historical-goods-extdom.component';
import { ModalScanningFoilTableHistoricalGoodsComponent } from './modal-scanning-foil/modal-scanning-foil.component';
import { ScanningFoilHistoricalGoodsExtDomComponent } from './scanning-foil/scanning-foil.component';

@NgModule({
  declarations: [
    GoodsProcessValidationExtdomComponent,
    HistoricalGoodsExtDomComponent,
    ModalScanningFoilTableHistoricalGoodsComponent,
    ScanningFoilHistoricalGoodsExtDomComponent,
    EmailGoodProcessValidationComponent,
  ],
  imports: [
    CommonModule,
    GoodsProcessValidationExtdomRoutingModule,
    SharedModule,
    FormLoaderComponent,
    TooltipModule.forRoot(),
  ],
})
export class GoodsProcessValidationExtdomModule {}

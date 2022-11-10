import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
//Routing
import { CBTcvMTaxValidationCalculationRoutingModule } from './c-b-tcv-m-tax-validation-calculation-routing.module';
//Standalone Components
import { GoodsSharedComponent } from 'src/app/@standalone/shared-forms/goods-shared/goods-shared.component';
//Components
import { CBICInconsistenciesComponent } from './inconsistencies/c-b-i-c-inconsistencies.component';
import { CBRcCRateChangeComponent } from './rate-change/c-b-rc-c-rate-change.component';
import { CBTcvCTaxValidationCalculationComponent } from './tax-calculation-validation/c-b-tcv-c-tax-validation-calculation.component';

@NgModule({
  declarations: [
    CBTcvCTaxValidationCalculationComponent,
    CBICInconsistenciesComponent,
    CBRcCRateChangeComponent,
  ],
  imports: [
    CommonModule,
    CBTcvMTaxValidationCalculationRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    ModalModule.forChild(),
    GoodsSharedComponent,
  ],
})
export class CBTcvMTaxValidationCalculationModule {}

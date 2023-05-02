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
import { TaxValidationCalculationRoutingModule } from './tax-validation-calculation-routing.module';
//Standalone Components
import { GoodsSharedComponent } from 'src/app/@standalone/shared-forms/goods-shared/goods-shared.component';
//Components
import { InconsistenciesComponent } from './inconsistencies/inconsistencies.component';
import { RateChangeComponent } from './rate-change/rate-change.component';
import { TaxValidationCalculationComponent } from './tax-calculation-validation/tax-validation-calculation.component';

@NgModule({
  declarations: [
    TaxValidationCalculationComponent,
    InconsistenciesComponent,
    RateChangeComponent,
  ],
  imports: [
    CommonModule,
    TaxValidationCalculationRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    ModalModule.forChild(),
    GoodsSharedComponent,
  ],
})
export class TaxValidationCalculationModule {}

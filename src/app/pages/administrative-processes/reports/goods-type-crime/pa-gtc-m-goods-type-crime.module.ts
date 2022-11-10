import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
//Routing
import { PaGtcMGoodsTypeCrimeRoutingModule } from './pa-gtc-m-goods-type-crime-routing.module';
//@Standalone Components
import { AreasSharedComponent } from 'src/app/@standalone/shared-forms/areas-shared/areas-shared.component';
import { CrimesSharedComponent } from 'src/app/@standalone/shared-forms/crimes-shared/crimes-shared.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
//Components
import { PaGtcrCGoodsTypeCrimeReportsComponent } from './goods-type-crime-reports/pa-gtcr-c-goods-type-crime-reports.component';

@NgModule({
  declarations: [PaGtcrCGoodsTypeCrimeReportsComponent],
  imports: [
    CommonModule,
    PaGtcMGoodsTypeCrimeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BsDatepickerModule,
    DelegationSharedComponent,
    CrimesSharedComponent,
    AreasSharedComponent,
    GoodsTypesSharedComponent,
  ],
})
export class PaGtcMGoodsTypeCrimeModule {}

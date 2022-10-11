import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Routing
import { PaUcpMUnitConversionPackagesRoutingModule } from './pa-ucp-m-unit-conversion-packages-routing.module';
//Components
import { PaUcpmcCMassiveConversionComponent } from './massive-conversion/pa-ucpmc-c-massive-conversion.component';
//@Standalone Components
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { WarehouseSharedComponent } from 'src/app/@standalone/shared-forms/warehouse-shared/warehouse-shared.component';
import { GoodsStatusSharedComponent } from 'src/app/@standalone/shared-forms/goods-status-shared/goods-status-shared.component';
import { TransferenteSharedComponent } from 'src/app/@standalone/shared-forms/transferents-shared/transferents-shared.component';
import { MeasurementUnitsSharedComponent  } from 'src/app/@standalone/shared-forms/measurement-units-shared/measurement-units-shared.component';
import { GoodsClasificationSharedComponent } from 'src/app/@standalone/shared-forms/goods-classification-shared/goods-classification-shared.component';
import { TargetTagsSharedComponent } from 'src/app/@standalone/shared-forms/target-tags-shared/target-tags-shared.component';
import { PackagesSharedComponent } from 'src/app/@standalone/shared-forms/packages-shared/packages-shared.component';

@NgModule({
  declarations: [
    PaUcpmcCMassiveConversionComponent
  ],
  imports: [
    CommonModule,
    PaUcpMUnitConversionPackagesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DelegationSharedComponent,
    WarehouseSharedComponent,
    GoodsStatusSharedComponent,
    TransferenteSharedComponent,
    MeasurementUnitsSharedComponent,
    GoodsClasificationSharedComponent,
    TargetTagsSharedComponent,
    PackagesSharedComponent
  ]
})
export class PaUcpMUnitConversionPackagesModule { }

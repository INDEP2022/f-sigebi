import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Routing
import { UnitConversionPackagesRoutingModule } from './unit-conversion-packages-routing.module';
//Components
import { MassiveConversionComponent } from './massive-conversion/massive-conversion.component';
//@Standalone Components
import { ModalModule } from 'ngx-bootstrap/modal';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { GoodsClasificationSharedComponent } from 'src/app/@standalone/shared-forms/goods-classification-shared/goods-classification-shared.component';
import { GoodsStatusSharedComponent } from 'src/app/@standalone/shared-forms/goods-status-shared/goods-status-shared.component';
import { MeasurementUnitsSharedComponent } from 'src/app/@standalone/shared-forms/measurement-units-shared/measurement-units-shared.component';
import { PackagesSharedComponent } from 'src/app/@standalone/shared-forms/packages-shared/packages-shared.component';
import { TargetTagsSharedComponent } from 'src/app/@standalone/shared-forms/target-tags-shared/target-tags-shared.component';
import { TransferenteSharedComponent } from 'src/app/@standalone/shared-forms/transferents-shared/transferents-shared.component';
import { WarehouseSharedComponent } from 'src/app/@standalone/shared-forms/warehouse-shared/warehouse-shared.component';
import { MasiveConversionPermissionsDeleteComponent } from './masive-conversion-permissions-delete/masive-conversion-permissions-delete.component';
import { MassiveConversionPermissionsComponent } from './massive-conversion-permissions/massive-conversion-permissions.component';

@NgModule({
  declarations: [
    MassiveConversionComponent,
    MassiveConversionPermissionsComponent,
    MasiveConversionPermissionsDeleteComponent,
  ],
  imports: [
    CommonModule,
    UnitConversionPackagesRoutingModule,
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
    PackagesSharedComponent,
    ModalModule.forChild(),
  ],
})
export class UnitConversionPackagesModule {}

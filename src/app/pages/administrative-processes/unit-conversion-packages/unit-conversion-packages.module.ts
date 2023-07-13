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
import { ScanFileSharedComponent } from 'src/app/@standalone/shared-forms/scan-file-shared/scan-file-shared.component';
import { TargetTagsSharedComponent } from 'src/app/@standalone/shared-forms/target-tags-shared/target-tags-shared.component';
import { TransferenteSharedComponent } from 'src/app/@standalone/shared-forms/transferents-shared/transferents-shared.component';
import { WarehouseSharedComponent } from 'src/app/@standalone/shared-forms/warehouse-shared/warehouse-shared.component';
import { MasiveConversionPermissionsDeleteComponent } from './masive-conversion-permissions-delete/masive-conversion-permissions-delete.component';
import { EmailModalComponent } from './massive-conversion-email-modal/email-modal.component';
import { MassiveConversionErrorsModalComponent } from './massive-conversion-erros-list/massive-conversion-errors-modal/massive-conversion-errors-modal.component';
import { MassiveConversionModalGoodComponent } from './massive-conversion-modal-good/massive-conversion-modal-good.component';
import { MassiveConversionPermissionsComponent } from './massive-conversion-permissions/massive-conversion-permissions.component';
import { MassiveConversionSelectGoodComponent } from './massive-conversion-select-good/massive-conversion-select-good.component';
import { PaqDestinoDetComponent } from './massive-conversion/paq-destino-det/paq-destino-det.component';
import { ScanFileComponent } from './massive-conversion/scan-file/scan-file.component';

@NgModule({
  declarations: [
    MassiveConversionComponent,
    MassiveConversionErrorsModalComponent,
    MassiveConversionPermissionsComponent,
    MasiveConversionPermissionsDeleteComponent,
    MassiveConversionModalGoodComponent,
    MassiveConversionSelectGoodComponent,
    PaqDestinoDetComponent,
    EmailModalComponent,
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
    ScanFileSharedComponent,
    ModalModule.forChild(),
    ScanFileComponent,
  ],
})
export class UnitConversionPackagesModule {}

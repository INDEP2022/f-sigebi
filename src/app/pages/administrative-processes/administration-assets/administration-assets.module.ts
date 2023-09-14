import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GoodsFilterSharedComponent } from 'src/app/@standalone/shared-forms/goods-shared/goods-filter-shared';

import { GoodsTypesSharedGoodComponent } from 'src/app/@standalone/shared-forms/goods-types-shared-good/goods-types-shared.component';
import { ServicesSharedComponent } from 'src/app/@standalone/shared-forms/services-shared/services-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoodsCharacteristicsModule } from '../../general-processes/goods-characteristics/goods-characteristics.module';
import { AdministrationAssetsRoutingModule } from './administration-assets-routing.module';
import { AdministrationAssetsComponent } from './administration-assets.component';
import { AppointmentDataComponent } from './appointment-data/appointment-data.component';
import { AssignedVaultsComponent } from './assigned-vaults/assigned-vaults.component';
import { DataValuationsComponent } from './data-valuations/data-valuations.component';
import { DepositaryReportComponent } from './depositary-report/depositary-report.component';
import { GeneralDataGoodsComponent } from './general-data-goods/general-data-goods.component';
import { HouseholdComponent } from './household/household.component';
import { IncomePerAssetComponent } from './income-per-asset/income-per-asset.component';
import { InventoryDataComponent } from './inventory-data/inventory-data.component';
import { RegisterModalComponent } from './inventory-data/register-modal/register-modal.component';
import { RegisterServiceComponent } from './registry-services/register-service/register-service.component';
import { RegistryServicesComponent } from './registry-services/registry-services.component';
import { SearchTabComponent } from './search-tab/search-tab.component';
import { SecureDataComponent } from './secure-data/secure-data.component';
import { WarehousesAssignedComponent } from './warehouses-assigned/warehouses-assigned.component';

@NgModule({
  declarations: [
    SearchTabComponent,
    AdministrationAssetsComponent,
    GeneralDataGoodsComponent,
    InventoryDataComponent,
    DataValuationsComponent,
    DepositaryReportComponent,
    HouseholdComponent,
    IncomePerAssetComponent,
    RegistryServicesComponent,
    SecureDataComponent,
    AssignedVaultsComponent,
    AppointmentDataComponent,
    WarehousesAssignedComponent,
    RegisterModalComponent,
    RegisterServiceComponent,
  ],
  imports: [
    CommonModule,
    AdministrationAssetsRoutingModule,
    TabsModule,
    GoodsTypesSharedGoodComponent,
    GoodsFilterSharedComponent,
    SharedModule,
    ServicesSharedComponent,
    GoodsCharacteristicsModule,
  ],
})
export class AdministrationAssetsModule {}

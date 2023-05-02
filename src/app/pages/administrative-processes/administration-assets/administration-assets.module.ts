import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GoodsFilterSharedComponent } from 'src/app/@standalone/shared-forms/goods-shared/goods-filter-shared';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { AdministrationAssetsRoutingModule } from './administration-assets-routing.module';
import { AdministrationAssetsComponent } from './administration-assets.component';
import { DataValuationsComponent } from './data-valuations/data-valuations.component';
import { DepositaryReportComponent } from './depositary-report/depositary-report.component';
import { GeneralDataGoodsComponent } from './general-data-goods/general-data-goods.component';
import { HouseholdComponent } from './household/household.component';
import { IncomePerAssetComponent } from './income-per-asset/income-per-asset.component';
import { InventoryDataComponent } from './inventory-data/inventory-data.component';
import { RegistryServicesComponent } from './registry-services/registry-services.component';
import { SearchTabComponent } from './search-tab/search-tab.component';
import { SecureDataComponent } from './secure-data/secure-data.component';

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
  ],
  imports: [
    CommonModule,
    AdministrationAssetsRoutingModule,
    TabsModule,
    GoodsTypesSharedComponent,
    GoodsFilterSharedComponent,
    SharedModule,
  ],
})
export class AdministrationAssetsModule {}

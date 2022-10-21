import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { AdministrationAssetsRoutingModule } from './administration-assets-routing.module';
import { AdministrationAssetsComponent } from './administration-assets.component';
import { SearchTabComponent } from './search-tab/search-tab.component';

@NgModule({
  declarations: [SearchTabComponent, AdministrationAssetsComponent],
  imports: [
    CommonModule,
    AdministrationAssetsRoutingModule,
    TabsModule,
    GoodsTypesSharedComponent,
    SharedModule,
  ],
})
export class AdministrationAssetsModule {}

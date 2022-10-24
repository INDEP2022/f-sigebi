import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';

import { RouterLink, RouterLinkActive } from '@angular/router';

import { PeAabMAnnualAccumulatedAssetsModule } from '../pe-aab-m-annual-accumulated-assets/pe-aab-m-annual-accumulated-assets.module';

import { AcumulativeAssetTabsRoutingModule } from './acumulative-asset-tabs-routing.module';
import { AcumulativeAssetTabsComponent } from './acumulative-asset-tabs/acumulative-asset-tabs.component';

@NgModule({
  declarations: [AcumulativeAssetTabsComponent],
  imports: [
    CommonModule,
    AcumulativeAssetTabsRoutingModule,
    TabsModule.forRoot(),
    RouterLink,
    RouterLinkActive,
    PeAabMAnnualAccumulatedAssetsModule,
  ],
})
export class AcumulativeAssetTabsModule {}

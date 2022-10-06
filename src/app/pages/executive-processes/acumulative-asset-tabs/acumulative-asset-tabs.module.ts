import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabsModule } from 'ngx-bootstrap/tabs';

import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';

import { AcumulativeAssetTabsRoutingModule } from './acumulative-asset-tabs-routing.module';
import { AcumulativeAssetTabsComponent } from './acumulative-asset-tabs/acumulative-asset-tabs.component';



@NgModule({
  declarations: [
    AcumulativeAssetTabsComponent
  ],
  imports: [
    CommonModule,
    AcumulativeAssetTabsRoutingModule,
    TabsModule.forRoot(),
    RouterLink,
    RouterLinkActive
  ]
})
export class AcumulativeAssetTabsModule { }

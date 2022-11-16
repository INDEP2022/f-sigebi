import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { EconomicResourcesDocumentationFormComponent } from './economic-resources-documentation-form/economic-resources-documentation-form.component';
import { GreCEconomicResourcesMainComponent } from './gre-c-economic-resources-main/gre-c-economic-resources-main.component';
import { GreMEconomicResourcesRoutingModule } from './gre-m-economic-resources-routing.module';

@NgModule({
  declarations: [
    GreCEconomicResourcesMainComponent,
    EconomicResourcesDocumentationFormComponent,
  ],
  imports: [
    CommonModule,
    GreMEconomicResourcesRoutingModule,
    SharedRequestModule,
    SharedModule,
    TabsModule,
  ],
})
export class GreMEconomicResourcesModule {}

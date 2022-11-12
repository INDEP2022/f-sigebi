import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { CPMWareahouseCatalogRoutingModule } from './c-p-m-wareahouse-catalog-routing.module';
import { CPWcCWareahouseCatalogComponent } from './c-p-wc-c-wareahouse-catalog/c-p-wc-c-wareahouse-catalog.component';

@NgModule({
  declarations: [CPWcCWareahouseCatalogComponent],
  imports: [CommonModule, CPMWareahouseCatalogRoutingModule, SharedModule],
})
export class CPMWareahouseCatalogModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { CPCFlyerSubjectCatalogComponent } from './c-p-c-flyer-subject-catalog/c-p-c-flyer-subject-catalog.component';
import { CPMFlyerSubjectCatalogRoutingModule } from './c-p-m-flyer-subject-catalog-routing.module';

@NgModule({
  declarations: [CPCFlyerSubjectCatalogComponent],
  imports: [CommonModule, CPMFlyerSubjectCatalogRoutingModule, SharedModule],
})
export class CPMFlyerSubjectCatalogModule {}

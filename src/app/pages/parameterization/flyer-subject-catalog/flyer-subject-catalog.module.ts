import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { FlyerSubjectCatalogRoutingModule } from './flyer-subject-catalog-routing.module';
import { FlyerSubjectCatalogComponent } from './flyer-subject-catalog/flyer-subject-catalog.component';

@NgModule({
  declarations: [FlyerSubjectCatalogComponent],
  imports: [CommonModule, FlyerSubjectCatalogRoutingModule, SharedModule],
})
export class FlyerSubjectCatalogModule {}

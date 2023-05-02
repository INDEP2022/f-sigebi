import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { ModalModule } from 'ngx-bootstrap/modal';
import { AffairModalComponent } from './affair-modal/affair-modal.component';
import { FlyerSubjectCatalogModelComponent } from './flyer-subject-catalog-model/flyer-subject-catalog-model.component';
import { FlyerSubjectCatalogRoutingModule } from './flyer-subject-catalog-routing.module';
import { FlyerSubjectCatalogComponent } from './flyer-subject-catalog/flyer-subject-catalog.component';

@NgModule({
  declarations: [
    FlyerSubjectCatalogComponent,
    FlyerSubjectCatalogModelComponent,
    AffairModalComponent,
  ],
  imports: [
    CommonModule,
    FlyerSubjectCatalogRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class FlyerSubjectCatalogModule {}

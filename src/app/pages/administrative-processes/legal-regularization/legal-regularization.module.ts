import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Ngx Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';

//Components
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { LegalRegularizationRoutingModule } from './legal-regularization-routing.module';
import { LegalRegularizationComponent } from './legal-regularization/legal-regularization.component';
import { ScanningFoilComponent } from './scanning-foil/scanning-foil.component';

@NgModule({
  declarations: [LegalRegularizationComponent, ScanningFoilComponent],
  imports: [
    CommonModule,
    SharedModule,
    LegalRegularizationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BsDropdownModule,
    BsDatepickerModule,
    TabsModule,
    ModalModule.forChild(),
    GoodsTypesSharedComponent,
  ],
})
export class LegalRegularizationModule {}

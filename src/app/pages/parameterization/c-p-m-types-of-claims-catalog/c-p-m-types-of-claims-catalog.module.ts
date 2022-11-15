import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CPMTypesOfClaimsCatalogRoutingModule } from './c-p-m-types-of-claims-catalog-routing.module';
import { CPTccCTypesOfClaimsCatalogComponent } from './c-p-tcc-c-types-of-claims-catalog/c-p-tcc-c-types-of-claims-catalog.component';
import { ModalTypeOfClaimsComponent } from './modal-type-of-claims/modal-type-of-claims.component';

@NgModule({
  declarations: [
    CPTccCTypesOfClaimsCatalogComponent,
    ModalTypeOfClaimsComponent,
  ],
  imports: [
    CommonModule,
    CPMTypesOfClaimsCatalogRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CPMTypesOfClaimsCatalogModule {}

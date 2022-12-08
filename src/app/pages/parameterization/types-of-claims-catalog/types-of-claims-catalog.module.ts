import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalTypeOfClaimsComponent } from './modal-type-of-claims/modal-type-of-claims.component';
import { TypesOfClaimsCatalogRoutingModule } from './types-of-claims-catalog-routing.module';
import { TypesOfClaimsCatalogComponent } from './types-of-claims-catalog/types-of-claims-catalog.component';

@NgModule({
  declarations: [TypesOfClaimsCatalogComponent, ModalTypeOfClaimsComponent],
  imports: [
    CommonModule,
    TypesOfClaimsCatalogRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class TypesOfClaimsCatalogModule {}

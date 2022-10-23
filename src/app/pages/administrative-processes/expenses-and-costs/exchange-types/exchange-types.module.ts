import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExchangeTypesRoutingModule } from './exchange-types-routing.module';
import { ExchangeTypesComponent } from './exchange-types/exchange-types.component';
import { ExchangeTypesDetailComponent } from './exchange-types-detail/exchange-types-detail.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [ExchangeTypesComponent, ExchangeTypesDetailComponent],
  imports: [
    CommonModule,
    ExchangeTypesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
  ],
})
export class ExchangeTypesModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//NGX-Bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Routing
import { SaleStatusRoutingModule } from './sale-status-routing.module';
//Components
import { SaleStatusFormComponent } from './sale-status-form/sale-status-form.component';
import { SaleStatusComponent } from './sale-status/sale-status.component';

@NgModule({
  declarations: [SaleStatusComponent, SaleStatusFormComponent],
  imports: [
    CommonModule,
    SaleStatusRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
  ],
})
export class SaleStatusModule {}

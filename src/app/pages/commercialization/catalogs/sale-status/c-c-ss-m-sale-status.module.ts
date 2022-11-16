import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//NGX-Bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Routing
import { CCSsMSaleStatusRoutingModule } from './c-c-ss-m-sale-status-routing.module';
//Components
import { CCSsCSaleStatusComponent } from './sale-status/c-c-ss-c-sale-status.component';
import { CCSsfCSaleStatusFormComponent } from './sale-status-form/c-c-ssf-c-sale-status-form.component';

@NgModule({
  declarations: [CCSsCSaleStatusComponent, CCSsfCSaleStatusFormComponent],
  imports: [
    CommonModule,
    CCSsMSaleStatusRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forChild()
  ],
})
export class CCSsMSaleStatusModule {}

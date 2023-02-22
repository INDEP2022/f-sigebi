import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Ngx Bootstrap
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
//Routing
import { CustomersRoutingModule } from './customers-routing.module';
//Components
import { CustomersListComponent } from './customers-list/customers-list.component';
import { CustomersRepresentativesComponent } from './customers-representatives/customers-representatives.component';

@NgModule({
  declarations: [CustomersListComponent, CustomersRepresentativesComponent],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    SharedModule,
    BsDropdownModule,
    ModalModule.forChild(),
  ],
})
export class CustomersModule {}

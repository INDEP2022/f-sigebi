import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Ngx Bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
//Routing
import { CCCMCustomersRoutingModule } from './c-c-c-m-customers-routing.module';
//Components
import { CClCCustomersListComponent } from './customers-list/c-cl-c-customers-list.component';
import { CCrCCustomersRepresentativesComponent } from './customers-representatives/c-cr-c-customers-representatives.component';


@NgModule({
  declarations: [
    CClCCustomersListComponent,
    CCrCCustomersRepresentativesComponent
  ],
  imports: [
    CommonModule,
    CCCMCustomersRoutingModule,
    SharedModule,
    BsDropdownModule,
    ModalModule.forChild()
  ]
})
export class CCCMCustomersModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Ngx Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
//Routing
import { CustomersRoutingModule } from './customers-routing.module';
//Components
import { CustomersBlackListComponent } from './customers-black-list/customers-black-list.component';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { CustomersRepresentantsListComponent } from './customers-list/customers-representants-list/customers-representants-list.component';
import { CustomersModalComponent } from './customers-modal/customers-modal.component';
import { CustomersWhiteListComponent } from './customers-white-list/customers-white-list.component';
import { RepresentativesModalComponent } from './representatives-modal/representatives-modal.component';

@NgModule({
  declarations: [
    CustomersListComponent,
    CustomersBlackListComponent,
    CustomersWhiteListComponent,
    CustomersModalComponent,
    RepresentativesModalComponent,
    CustomersRepresentantsListComponent,
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    SharedModule,
    BsDropdownModule,
    ModalModule.forChild(),
    BsDatepickerModule,
  ],
})
export class CustomersModule {}

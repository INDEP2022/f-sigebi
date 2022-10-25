import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
import { RenderComponentsModule } from 'src/app/shared/render-components/render-components.module'
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
//Routing
import { PaRcMReturnsConficationsRoutingModule } from './pa-rc-m-returns-confications-routing.module';
//Standalone Components
import { RecordsSharedComponent } from 'src/app/@standalone/shared-forms/records-shared/records-shared.component';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';
//Components
import { PaRclCReturnsConficationsListComponent } from './returns-confications-list/pa-rcl-c-returns-confications-list.component';


@NgModule({
  declarations: [
    PaRclCReturnsConficationsListComponent
  ],
  imports: [
    CommonModule,
    PaRcMReturnsConficationsRoutingModule,
    SharedModule,
    RenderComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    RecordsSharedComponent,
    UsersSharedComponent
  ]
})
export class PaRcMReturnsConficationsModule { }

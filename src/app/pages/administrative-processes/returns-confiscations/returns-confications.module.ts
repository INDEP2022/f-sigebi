import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { RenderComponentsModule } from 'src/app/shared/render-components/render-components.module';
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
//Routing
import { ReturnsConficationsRoutingModule } from './returns-confications-routing.module';
//Standalone Components
import { RecordsSharedComponent } from 'src/app/@standalone/shared-forms/records-shared/records-shared.component';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';
//Components
import { ReturnsConficationsListComponent } from './returns-confications-list/returns-confications-list.component';

@NgModule({
  declarations: [ReturnsConficationsListComponent],
  imports: [
    CommonModule,
    ReturnsConficationsRoutingModule,
    SharedModule,
    RenderComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    RecordsSharedComponent,
    UsersSharedComponent,
  ],
})
export class ReturnsConficationsModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestRoutingModule } from './request-routing.module';
import { RequestListComponent } from './request-list/request-list.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    RequestListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RequestRoutingModule
  ]
})
export class RequestModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { TabsModule } from 'ngx-bootstrap/tabs';

import { HomeComponent } from './home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    TabsModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }

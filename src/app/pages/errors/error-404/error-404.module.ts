import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { Error404RoutingModule } from './error-404-routing.module';
import { ErrorComponent } from './error.component';

@NgModule({
  declarations: [ErrorComponent],
  imports: [CommonModule, Error404RoutingModule],
})
export class Error404Module {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from '../../../../shared/shared.module';
import { SurveillanceServiceRoutingModule } from './surveillance-service-routing.module';
import { ListComponent } from './surveillance-service/list/list.component';
import { SurveillanceServiceComponent } from './surveillance-service/surveillance-service.component';
@NgModule({
  declarations: [SurveillanceServiceComponent, ListComponent],
  imports: [
    CommonModule,
    SurveillanceServiceRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormLoaderComponent,
    TooltipModule.forRoot(),
  ],
})
export class SurveillanceServiceModule {}

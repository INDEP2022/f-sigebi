/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { CaptureFormalizingLawyersRoutingModule } from './capture-formalizing-lawyers-routing.module';

/** COMPONENTS IMPORTS */
import { CaptureFormalizingLawyersComponent } from './capture-formalizing-lawyers/capture-formalizing-lawyers.component';
import { FormCaptureLawyersComponent } from './form-capture-lawyers/form-capture-lawyers.component';

@NgModule({
  declarations: [
    CaptureFormalizingLawyersComponent,
    FormCaptureLawyersComponent,
  ],
  imports: [CommonModule, CaptureFormalizingLawyersRoutingModule, SharedModule],
})
export class CaptureFormalizingLawyersModule {}

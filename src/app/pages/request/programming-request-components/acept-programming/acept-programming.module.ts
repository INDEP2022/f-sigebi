import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AceptProgrammingFormComponent } from './acept-programming-form/acept-programming-form.component';
import { AceptProgrammingRoutingModule } from './acept-programming-routing.module';

@NgModule({
  declarations: [AceptProgrammingFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    TabsModule,
    AceptProgrammingRoutingModule,
    FormLoaderComponent,
    ModalModule.forChild(),
  ],
})
export class AceptProgrammingModule {}

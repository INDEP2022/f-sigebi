import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActsRegularizationNonExistenceRoutingModule } from './acts-regularization-non-existence-routing.module';
import { ActsRegularizationNonExistenceComponent } from './acts-regularization-non-existence/acts-regularization-non-existence.component';
import { AddAndUpdateComponent } from './acts-regularization-non-existence/modal-mantenimiento-estatus-act/add-and-update/add-and-update.component';
import { ModalMantenimientoEstatusActComponent } from './acts-regularization-non-existence/modal-mantenimiento-estatus-act/modal-mantenimiento-estatus-act.component';
@NgModule({
  declarations: [
    ActsRegularizationNonExistenceComponent,
    ModalMantenimientoEstatusActComponent,
    AddAndUpdateComponent,
  ],
  imports: [
    CommonModule,
    ActsRegularizationNonExistenceRoutingModule,
    SharedModule,
    FormsModule,
    NgScrollbarModule,
    AccordionModule,
    TooltipModule,
    FormLoaderComponent,
  ],
})
export class ActsRegularizationNonExistenceModule {}

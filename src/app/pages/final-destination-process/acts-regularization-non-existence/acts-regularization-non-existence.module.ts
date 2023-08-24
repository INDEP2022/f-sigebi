import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActsRegularizationNonExistenceRoutingModule } from './acts-regularization-non-existence-routing.module';
import { ActsRegularizationNonExistenceComponent } from './acts-regularization-non-existence/acts-regularization-non-existence.component';
import { ModalMantenimientoEstatusActComponent } from './acts-regularization-non-existence/modal-mantenimiento-estatus-act/modal-mantenimiento-estatus-act.component';
@NgModule({
  declarations: [
    ActsRegularizationNonExistenceComponent,
    ModalMantenimientoEstatusActComponent,
  ],
  imports: [
    CommonModule,
    ActsRegularizationNonExistenceRoutingModule,
    SharedModule,
    FormsModule,
  ],
})
export class ActsRegularizationNonExistenceModule {}

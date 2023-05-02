import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActsRegularizationNonExistenceRoutingModule } from './acts-regularization-non-existence-routing.module';
import { ActsRegularizationNonExistenceComponent } from './acts-regularization-non-existence/acts-regularization-non-existence.component';

@NgModule({
  declarations: [ActsRegularizationNonExistenceComponent],
  imports: [
    CommonModule,
    ActsRegularizationNonExistenceRoutingModule,
    SharedModule,
    FormsModule,
  ],
})
export class ActsRegularizationNonExistenceModule {}

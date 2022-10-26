import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FdpArifCActsRegularizationNonExistenceComponent } from './acts-regularization-non-existence/fdp-arif-c-acts-regularization-non-existence.component';
import { FdpArifMActsRegularizationNonExistenceRoutingModule } from './fdp-arif-m-acts-regularization-non-existence-routing.module';

@NgModule({
  declarations: [FdpArifCActsRegularizationNonExistenceComponent],
  imports: [
    CommonModule,
    FdpArifMActsRegularizationNonExistenceRoutingModule,
    SharedModule,
    FormsModule,
  ],
})
export class FdpArifMActsRegularizationNonExistenceModule {}

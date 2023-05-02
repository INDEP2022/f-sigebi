import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActsCircumstantiatedCancellationTheftRoutingModule } from './acts-circumstantiated-cancellation-theft-routing.module';
import { ActsCircumstantiatedCancellationTheftComponent } from './acts-circumstantiated-cancellation-theft/acts-circumstantiated-cancellation-theft.component';

@NgModule({
  declarations: [ActsCircumstantiatedCancellationTheftComponent],
  imports: [
    CommonModule,
    ActsCircumstantiatedCancellationTheftRoutingModule,
    SharedModule,
    FormsModule,
  ],
})
export class ActsCircumstantiatedCancellationTheftModule {}

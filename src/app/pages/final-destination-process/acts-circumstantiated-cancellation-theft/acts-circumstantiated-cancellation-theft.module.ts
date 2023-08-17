import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActsCircumstantiatedCancellationTheftRoutingModule } from './acts-circumstantiated-cancellation-theft-routing.module';
import { ActsCircumstantiatedCancellationTheftComponent } from './acts-circumstantiated-cancellation-theft/acts-circumstantiated-cancellation-theft.component';
import { CreateActaComponent } from './create-acta/create-acta.component';
import { FindActaComponent } from './find-acta/find-acta.component';
import { FindAllExpedientComponent } from './find-all-expedient/find-all-expedient.component';
import { ModalScanningFoilComponent } from './modal-scanning-foil/modal-scanning-foil.component';
import { ScanningFoilComponent } from './scanning-foil/scanning-foil.component';

@NgModule({
  declarations: [
    ActsCircumstantiatedCancellationTheftComponent,
    FindAllExpedientComponent,
    FindActaComponent,
    CreateActaComponent,
    ModalScanningFoilComponent,
    ScanningFoilComponent,
  ],
  imports: [
    CommonModule,
    ActsCircumstantiatedCancellationTheftRoutingModule,
    SharedModule,
    FormLoaderComponent,
    FormsModule,
  ],
})
export class ActsCircumstantiatedCancellationTheftModule {}

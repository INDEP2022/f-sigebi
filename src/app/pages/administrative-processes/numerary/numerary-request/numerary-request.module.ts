import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ListNumeraryComponent } from './list-data/list-numerary.component';
import { NumeraryRequestRoutingModule } from './numerary-request-routing.module';
import { NumeraryRequestComponent } from './numerary-request/numerary-request.component';

@NgModule({
  declarations: [NumeraryRequestComponent, ListNumeraryComponent],
  imports: [
    CommonModule,
    NumeraryRequestRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    TooltipModule.forRoot(),
    FormLoaderComponent,
  ],
})
export class NumeraryRequestModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';

import { SharedModule } from 'src/app/shared/shared.module';
import { AttributeParametrizationFormComponent } from './attribute-parametrization-form/attribute-parametrization-form.component';
import { AttributeParametrizationListComponent } from './attribute-parametrization-list/attribute-parametrization-list.component';
import { AttributeParametrizationRoutingModule } from './attribute-parametrization-routing.module';

@NgModule({
  declarations: [
    AttributeParametrizationListComponent,
    AttributeParametrizationFormComponent,
  ],
  imports: [
    CommonModule,
    AttributeParametrizationRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class AttributeParametrizationModule {}

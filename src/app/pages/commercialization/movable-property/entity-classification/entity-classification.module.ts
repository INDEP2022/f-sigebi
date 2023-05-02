import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';

import { RenderComponentsModule } from 'src/app/shared/render-components/render-components.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { EntityClasificationFormComponent } from './components/entity-clasification-form/entity-clasification-form.component';
import { EntityClassificationRoutingModule } from './entity-classification-routing.module';
import { EntityClassificationComponent } from './entity-classification/entity-classification.component';

@NgModule({
  declarations: [
    EntityClassificationComponent,
    EntityClasificationFormComponent,
  ],
  imports: [
    CommonModule,
    EntityClassificationRoutingModule,
    SharedModule,
    RenderComponentsModule,
    ModalModule.forChild(),
  ],
})
export class EntityClassificationModule {}

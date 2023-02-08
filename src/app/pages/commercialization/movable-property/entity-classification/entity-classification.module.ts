import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RenderComponentsModule } from 'src/app/shared/render-components/render-components.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { EntityClassificationRoutingModule } from './entity-classification-routing.module';
import { EntityClassificationComponent } from './entity-classification/entity-classification.component';

@NgModule({
  declarations: [EntityClassificationComponent],
  imports: [
    CommonModule,
    EntityClassificationRoutingModule,
    SharedModule,
    RenderComponentsModule,
  ],
})
export class EntityClassificationModule {}

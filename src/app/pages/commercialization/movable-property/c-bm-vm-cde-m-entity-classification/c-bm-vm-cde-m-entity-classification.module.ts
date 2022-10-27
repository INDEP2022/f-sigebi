import { NgModule } from '@angular/core'; 
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { RenderComponentsModule } from 'src/app/shared/render-components/render-components.module'

import { CBmVmCdeMEntityClassificationRoutingModule } from './c-bm-vm-cde-m-entity-classification-routing.module';
import { CBmVmCdeCEntityClassificationComponent } from './c-bm-vm-cde-c-entity-classification/c-bm-vm-cde-c-entity-classification.component';


@NgModule({
  declarations: [
    CBmVmCdeCEntityClassificationComponent
  ],
  imports: [
    CommonModule,
    CBmVmCdeMEntityClassificationRoutingModule,
    SharedModule,
    RenderComponentsModule
  ]
})
export class CBmVmCdeMEntityClassificationModule { }

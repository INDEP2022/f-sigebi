import { NgModule } from '@angular/core';  
import { CommonModule } from '@angular/common';

import { ComponentsModule } from '../../../@components/components.module';

import { NgSelectModule } from '@ng-select/ng-select';

import { FactJurEmisionAcuRoutingModule } from './fact-jur-emision-acu.routing.module';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbInputModule, NbSelectModule, NbWindowModule, NbDatepickerModule } from '@nebular/theme';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FactJurEmisionAcuComponent } from './fact-jur-emision-acu/fact-jur-emision-acu.component';
import { SharedLegalProcessModule } from '../shared-legal-process/shared-legal-process.module';

@NgModule({ 
  declarations: [ 
    FactJurEmisionAcuComponent,
    
  ],
  imports: [
    CommonModule,
    FactJurEmisionAcuRoutingModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    ThemeModule,
    NbCardModule,
    Ng2SmartTableModule,
    NbSelectModule,
    NbButtonModule,
    NbInputModule,
    NbWindowModule.forChild(),
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    NbDatepickerModule,
    NgSelectModule,

    SharedLegalProcessModule
  ],
  exports:[
    
    ComponentsModule, NgSelectModule
    
  ]
})
export class FactJurEmisionAcuModule { }


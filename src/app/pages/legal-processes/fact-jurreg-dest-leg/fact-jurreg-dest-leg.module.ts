import { NgModule } from '@angular/core';  
import { CommonModule } from '@angular/common';

import { ComponentsModule } from '../../../@components/components.module';

import { NgSelectModule } from '@ng-select/ng-select';

import { FactJurregDestLegRoutingModule } from './fact-jurreg-dest-leg.routing.module';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbInputModule, NbSelectModule, NbWindowModule, NbDatepickerModule, NbRadioModule, NbCheckboxModule } from '@nebular/theme';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FactJurregDestLegComponent } from './fact-jurreg-dest-leg/fact-jurreg-dest-leg.component';
import { SharedLegalProcessModule } from '../shared-legal-process/shared-legal-process.module';

@NgModule({ 
  declarations: [ 
    FactJurregDestLegComponent,
    
  ],
  imports: [
    CommonModule,
    FactJurregDestLegRoutingModule,
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
    NbRadioModule,
    NbCheckboxModule,

    SharedLegalProcessModule
  ],
  exports:[
    
    ComponentsModule, NgSelectModule
    
  ]
})
export class FactJurregDestLegModule { }


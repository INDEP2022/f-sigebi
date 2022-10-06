import { NgModule } from '@angular/core';  
import { CommonModule } from '@angular/common';

import { ComponentsModule } from '../../../@components/components.module';

import { NgSelectModule } from '@ng-select/ng-select';

import { FactGerDirNombraDepoRoutingModule } from './fact-ger-dir-nombra-depo.routing.module';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbInputModule, NbSelectModule, NbWindowModule, NbDatepickerModule } from '@nebular/theme';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FactGerDirNombraDepoComponent } from './fact-ger-dir-nombra-depo/fact-ger-dir-nombra-depo.component';

@NgModule({ 
  declarations: [ 
    FactGerDirNombraDepoComponent,
    
  ],
  imports: [
    CommonModule,
    FactGerDirNombraDepoRoutingModule,
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
    NgSelectModule
  ],
  exports:[
    
    ComponentsModule, NgSelectModule
    
  ]
})
export class FactGerDirNombraDepoModule { }


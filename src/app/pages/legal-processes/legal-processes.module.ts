import { NgModule } from '@angular/core';  
import { CommonModule } from '@angular/common';

// import { ComponentsModule } from '../../@components/components.module';

import { NgSelectModule } from '@ng-select/ng-select';

import { LegalProcessesRoutingModule, routedComponents } from './legal-processes.routing.module';

import { Ng2SmartTableModule } from 'ng2-smart-table';
// import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NbButtonModule, NbCardModule, NbInputModule, NbWindowModule } from '@nebular/theme';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { FlyersModule } from '../documents-reception/flyers/flyers.module';

@NgModule({ 
  declarations: [ 
    ...routedComponents, 
    
  ],
  imports: [
    // FlyersModule,
    
    CommonModule,
    LegalProcessesRoutingModule,
    // ComponentsModule,
    CommonModule,
    // ThemeModule,
    // NbCardModule,
    Ng2SmartTableModule,
    FormsModule,
    ReactiveFormsModule,
    // ThemeModule,
    // NbCardModule,
    // Ng2SmartTableModule,
    // NbButtonModule,
    // NbInputModule,
    // NbWindowModule.forChild(),
    // MatPaginatorModule,
    // MatInputModule,
    // MatFormFieldModule,
    NgSelectModule
  ],
  exports:[
    
    // ComponentsModule, 
    NgSelectModule
    
  ]
})
export class LegalProcessesModule { }

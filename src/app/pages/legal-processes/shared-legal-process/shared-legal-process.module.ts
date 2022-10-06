import { NgModule } from '@angular/core';  
import { CommonModule } from '@angular/common';

import { ComponentsModule } from '../../../@components/components.module';

import { NgSelectModule } from '@ng-select/ng-select';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbInputModule, NbSelectModule, NbWindowModule, NbDatepickerModule, NbTabsetModule, NbRadioModule } from '@nebular/theme';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

/** @Imports Componentes to import and export to use in others modules */
import { FormVolanteExpedienteComponent } from './form-volante-expediente/form-volante-expediente.component';
import { FormDeclaratoriaComponent } from './form-declaratoria/form-declaratoria.component';
import { FormOficioComponent } from './form-oficio/form-oficio.component';
import { FormDepositariaComponent } from './form-depositaria/form-depositaria.component';
import { FormFactAbandonosOficioComponent } from './fact-abandonos-oficio-tab/fact-abandonos-oficio.component';

export const declarationsExports: any[] = [
  FormVolanteExpedienteComponent,
  FormDeclaratoriaComponent,
  FormOficioComponent,
  FormDepositariaComponent,
  FormFactAbandonosOficioComponent
];
@NgModule({ 
  declarations: [ 
    declarationsExports,
    // FormVolanteExpedienteComponent,
    // FormDeclaratoriaComponent,
    // FormOficioComponent,
    // FormDepositariaComponent,
    // FormFactAbandonosOficioComponent
    
  ],
  imports: [
    CommonModule,
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
    NbTabsetModule,
    NbRadioModule
  ],
  exports:[
    declarationsExports,
    // FormVolanteExpedienteComponent,
    // FormDeclaratoriaComponent,
    // FormOficioComponent,
    // FormDepositariaComponent
    
  ]
})
export class SharedLegalProcessModule { }


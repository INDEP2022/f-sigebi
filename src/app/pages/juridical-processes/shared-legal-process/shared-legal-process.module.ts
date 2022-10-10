/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
/** LIBRERIAS EXTERNAS IMPORTS */
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
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
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    NgSelectModule,
    SharedModule
  ],
  exports:[
    declarationsExports,
  ]
})
export class SharedLegalProcessModule { }


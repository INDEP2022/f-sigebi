/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** LIBRERIAS EXTERNAS IMPORTS */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2SmartTableModule } from 'ng2-smart-table';

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
/** @Imports Componentes to import and export to use in others modules */
import { UsersAltaUsuarioComponent } from './users-alta-usuario/users-alta-usuario.component';
import { UsersAreaUsuarioComponent } from './users-area-usuario/users-area-usuario.component';
import { UsersBajaUsuarioComponent } from './users-baja-usuario/users-baja-usuario.component';
import { UsersDesbloqueoUsuarioComponent } from './users-desbloqueo-usuario/users-desbloqueo-usuario.component';
import { UsersIndicadoresUsuarioComponent } from './users-indicadores-usuario/users-indicadores-usuario.component';

export const declarationsExports: any[] = [
  UsersAltaUsuarioComponent,
  UsersAreaUsuarioComponent,
  UsersDesbloqueoUsuarioComponent,
  UsersBajaUsuarioComponent,
  UsersIndicadoresUsuarioComponent,
];
@NgModule({
  declarations: declarationsExports,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    NgSelectModule,
    SharedModule,
  ],
  exports: declarationsExports,
})
export class SharedComponentsSecurityModule {}

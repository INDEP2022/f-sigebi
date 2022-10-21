/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

// import { ComponentsModule } from '../../../@components/components.module';

import { NgSelectModule } from '@ng-select/ng-select';

import { FactAdbSolDestLegRoutingModule } from './fact-adb-sol-dest-leg.routing.module';

import { Ng2SmartTableModule } from 'ng2-smart-table';
// import { ThemeModule } from '../../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NbButtonModule, NbCardModule, NbInputModule, NbSelectModule, NbWindowModule, NbDatepickerModule } from '@nebular/theme';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
import { FactAdbSolDestLegComponent } from './fact-adb-sol-dest-leg/fact-adb-sol-dest-leg.component';

@NgModule({
  declarations: [FactAdbSolDestLegComponent],
  imports: [
    CommonModule,
    FactAdbSolDestLegRoutingModule,
    // ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    // ComponentsModule,
    // ThemeModule,
    // NbCardModule,
    Ng2SmartTableModule,
    // NbSelectModule,
    // NbButtonModule,
    // NbInputModule,
    // NbWindowModule.forChild(),
    // MatPaginatorModule,
    // MatInputModule,
    // MatFormFieldModule,
    // NbDatepickerModule,
    NgSelectModule,
    SharedModule,
  ],
  exports: [
    // ComponentsModule,
    NgSelectModule,
  ],
})
export class FactAdbSolDestLegModule {}

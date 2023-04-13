/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClassificationTypeSsubtypeOfGoodsSharedComponent } from 'src/app/@standalone/shared-forms/classification-type-ssubtype-of-goods-shared copy/classification-type-ssubtype-of-goods-shared';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { JuridicalRulingGRoutingModule } from './juridical-ruling-g-routing.module';

/** COMPONENTS IMPORTS */
import { JuridicalRulingGComponent } from './juridical-ruling-g/juridical-ruling-g.component';

@NgModule({
  declarations: [JuridicalRulingGComponent],
  imports: [
    CommonModule,
    JuridicalRulingGRoutingModule,
    SharedModule,
    UsersSharedComponent,
    ClassificationTypeSsubtypeOfGoodsSharedComponent,
  ],
  exports: [JuridicalRulingGComponent],
})
export class JuridicalRulingGModule {}

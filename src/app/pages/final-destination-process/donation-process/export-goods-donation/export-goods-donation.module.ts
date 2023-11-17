import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExportGoodsDonationRoutingModule } from './export-goods-donation-routing.module';
import { ExportGoodsDonationComponent } from './export-goods-donation/export-goods-donation.component';

@NgModule({
  declarations: [ExportGoodsDonationComponent],
  imports: [
    CommonModule,
    ExportGoodsDonationRoutingModule,
    FormLoaderComponent,
    SharedModule,
    FormsModule,
  ],
})
export class ExportGoodsDonationModule {}

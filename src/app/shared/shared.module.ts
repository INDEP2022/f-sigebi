import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnsSelectComponent } from './components/columns-select/columns-select.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { GlobalConfirmComponent } from './components/global-confirm/global-confirm.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ColumnsSelectComponent,
    FormFieldComponent,
    GlobalConfirmComponent,
    SearchBarComponent,
  ],
  imports: [CommonModule, BsDropdownModule, FormsModule, ReactiveFormsModule],
  exports: [ColumnsSelectComponent, FormFieldComponent, SearchBarComponent],
})
export class SharedModule {}

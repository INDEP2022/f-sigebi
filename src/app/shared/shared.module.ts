import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnsSelectComponent } from './components/columns-select/columns-select.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from './components/card/card.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [
    ColumnsSelectComponent,
    FormFieldComponent,
    SearchBarComponent,
    CardComponent,
    PaginationComponent,
    ModalComponent
  ],
  imports: [CommonModule, BsDropdownModule, FormsModule, ReactiveFormsModule],
  exports: [ColumnsSelectComponent, FormFieldComponent, SearchBarComponent, CardComponent, ModalComponent],
})
export class SharedModule { }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-get-cfdi',
  templateUrl: './get-cfdi.component.html',
  styles: [],
})
export class GetCfdiComponent extends BasePage implements OnInit {
  title: string = 'Búsqueda de CFDI';
  form: FormGroup = new FormGroup({});
  years: number[] = [];
  currentYear: number = new Date().getFullYear();
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  valSearch: boolean = false;
  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    for (let i = 1900; i <= this.currentYear; i++) {
      this.years.push(i);
    }
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      event: [null],
      lote: [null],
      year: [null],
    });
  }

  close() {
    this.modalRef.hide();
  }

  search() {
    this.valSearch = !this.valSearch;
  }
}

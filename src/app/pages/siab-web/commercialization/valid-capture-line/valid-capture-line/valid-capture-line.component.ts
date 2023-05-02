import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { VALID_CAPTURE_LINE_COLUMNS } from './valid-captura-line-columns';

@Component({
  selector: 'app-valid-capture-line',
  templateUrl: './valid-capture-line.component.html',
  styles: [],
})
export class validCaptureLineComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...VALID_CAPTURE_LINE_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getPagination();
  }

  private prepareForm() {
    this.form = this.fb.group({
      typeEvent: [null, [Validators.required]],
      idEvent: [null, [Validators.required]],
      allotment: [null, [Validators.required]],
      idClient: [null, [Validators.required]],
    });
  }

  data = [
    {
      id: 123,
      allotment: 564,
      amount: '$65,000.00',
      status: 'No disponible',
      type: 'Subasta',
      reference: 'Referencia 01',
      date: '31/05/2020',
      rfc: 'XXXX0000',
      idClient: 987,
      client: 'Esteban',
    },
  ];

  getPagination() {
    this.columns = this.data;
    this.totalItems = this.columns.length;
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { KEYGENERATION_PATTERN } from 'src/app/core/shared/patterns';
import { ADD_RELATED_EVENT_COLUMNS } from './create-modal-columns';

@Component({
  selector: 'app-create-control-modal',
  templateUrl: './create-control-modal.component.html',
  styles: [],
})
export class CreateControlModalComponent extends BasePage implements OnInit {
  title: string = 'Control de Devolución';
  controlForm: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  @Output() onControlAdded = new EventEmitter<boolean>();
  selectedRows: any[] = [];
  totalItems: number = 0;
  controlColumns: any[] = [];
  controlSettings = {
    ...TABLE_SETTINGS,
    actions: false,
    selectMode: 'multi',
  };

  eventsTestData = [
    {
      id: 1001,
      key: 'G17LONA6481EN',
      quantity: 6,
      amount: 10000,
    },
    {
      id: 1002,
      key: 'G17LONA294ON96',
      quantity: 8,
      amount: 15000,
    },
    {
      id: 1003,
      key: 'G17LON8KMGBN',
      quantity: 14,
      amount: 50000,
    },
    {
      id: 1004,
      key: 'G17LON64FAMO9',
      quantity: 7,
      amount: 11000,
    },
    {
      id: 1005,
      key: 'G17LONA451BTRS',
      quantity: 21,
      amount: 70000,
    },
  ];

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
    this.controlSettings.columns = ADD_RELATED_EVENT_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.controlForm = this.fb.group({
      key: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      direction: [null, [Validators.required]],
      dispersionType: [null, [Validators.required]],
      origin: [null, [Validators.required]],
      events: this.fb.array([null]),
    });
  }

  search() {
    this.controlColumns = this.eventsTestData;
    this.totalItems = this.controlColumns.length;
  }

  select(rows: any[]) {
    this.selectedRows = rows;
    console.log(this.selectedRows);
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.handleSuccess();
  }

  handleSuccess() {
    this.loading = true;
    // Llamar servicio para agregar control
    this.loading = false;
    this.onControlAdded.emit(true);
    this.modalRef.hide();
  }
}

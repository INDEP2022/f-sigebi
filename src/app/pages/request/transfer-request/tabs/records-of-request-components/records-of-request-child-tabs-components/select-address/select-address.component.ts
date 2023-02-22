import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { AddressTransferorTabComponent } from '../../address-transferor-tab/address-transferor-tab.component';
import { SELECT_ADDRESS_COLUMN } from './select-address-columns';

var data = [
  {
    aliaWarehouse: 'Domicilo transferente',
    status: 'ciudad de Mexico',
    municipe: '',
    suburb: '',
    cp: '',
    numExt: '',
    numInt: '',
  },
];

@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.component.html',
  styles: [],
})
export class SelectAddressComponent extends BasePage implements OnInit {
  paragraphs: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  title: string = 'Domicilios de la Solicitud';
  totalItems: number = 0;
  public event: EventEmitter<any> = new EventEmitter();
  rowSelected: any;
  address: any;
  onlyOrigin: boolean = false;

  constructor(
    private modelRef: BsModalRef,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log(this.onlyOrigin);

    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: SELECT_ADDRESS_COLUMN,
    };

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData(): void {
    if (this.paragraphs.length === 0) {
      this.paragraphs = data;
    }
  }

  newAddress() {
    let config: ModalOptions = {
      initialState: {
        isNewAddress: true,
        callback: (next: boolean) => {
          //if (next) this.getExample();
        },
      },
      class: 'modalSizeXL modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(AddressTransferorTabComponent, config);
  }

  selectRow(event: any): void {
    console.log(event);
    this.rowSelected = event.data;
  }

  selectAddress() {
    this.event.emit('event emitted');
    this.close();
  }

  close() {
    this.modelRef.hide();
  }
}

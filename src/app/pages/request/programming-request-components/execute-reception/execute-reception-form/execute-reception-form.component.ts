import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import {
  IUser,
  USER_COLUMNS,
} from '../../acept-programming/columns/users-columns';
import { AssignReceiptFormComponent } from '../assign-receipt-form/assign-receipt-form.component';
import { DocumentsListComponent } from '../documents-list/documents-list.component';
import { GenerateReceiptFormComponent } from '../generate-receipt-form/generate-receipt-form.component';
import { PhotographyFormComponent } from '../photography-form/photography-form.component';
import { ReschedulingFormComponent } from '../rescheduling-form/rescheduling-form.component';
import { WitnessFormComponent } from '../witness-form/witness-form.component';
import { RECEIPT_COLUMNS } from './columns/minute-columns';
import { TRANSPORTABLE_GOODS } from './columns/transportable-goods-columns';

@Component({
  selector: 'app-execute-reception-form',
  templateUrl: './execute-reception-form.component.html',
  styleUrls: ['./execute-reception.scss'],
})
export class ExecuteReceptionFormComponent implements OnInit {
  isDropup = true;
  settings = { ...TABLE_SETTINGS, actions: false };
  executeForm: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  settingsTranGoods = {
    ...TABLE_SETTINGS,
    actions: false,
    selectMode: 'multi',
  };
  settingsReceipt = { ...TABLE_SETTINGS };

  userData: IUser[] = [];
  //Cambiar a modelos//
  tranGoods: any[] = [];
  receipts: any;

  search: FormControl = new FormControl({});
  constructor(private modalService: BsModalService, private fb: FormBuilder) {
    this.receipts = [
      {
        noMinute: 1,
        receipt: 1,
        statusReceipt: 'Abierto',
        transerAmount: 3453345,
      },
    ];

    this.tranGoods = [
      {
        gestionNumber: 3424,
        uniqueKey: 42,
        record: 'Expediente',
        description: 'Descripción',
        descriptionSae: 'Sae descripción',
      },
    ];

    this.settings.columns = USER_COLUMNS;
    this.settingsTranGoods.columns = TRANSPORTABLE_GOODS;
    this.settingsReceipt.columns = RECEIPT_COLUMNS;
    this.settingsReceipt.actions.columnTitle = 'Generar recibo';
    this.settingsReceipt.actions.delete = true;
    this.settingsReceipt.edit.editButtonContent =
      '<i class="fa fa-file text-primary mx-2"></i>';
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.executeForm = this.fb.group({
      saeDescription: [null],
      saeAmount: [null],
      satUnit: [null],
      stateFisicSae: [null],
      stateConservationSae: [null],
      selectColumn: [null],
    });
  }

  uploadDocuments() {
    const uploadDocumentos = this.modalService.show(DocumentsListComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  uploadPicture() {
    const uploadPictures = this.modalService.show(PhotographyFormComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  createReceipt() {
    const createReceipt = this.modalService.show(GenerateReceiptFormComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  assignReceipt() {
    const assignReceipt = this.modalService.show(AssignReceiptFormComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  rescheduling() {
    const rescheduling = this.modalService.show(ReschedulingFormComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  showEstate() {
    alert('vista imprimir reporte');
  }

  delete() {}
}

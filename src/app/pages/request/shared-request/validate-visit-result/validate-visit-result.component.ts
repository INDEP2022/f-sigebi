import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
import { ConfirmValidationComponent } from './confirm-validation/confirm-validation.component';
import { ViewExpedientComponent } from './view-expedient/view-expedient.component';

@Component({
  selector: 'app-validate-visit-result',
  templateUrl: './validate-visit-result.component.html',
  styles: [],
})
export class ValidateVisitResultComponent extends BasePage implements OnInit {
  tableSettings: any;
  enableButton: boolean = false;
  rowsSelected: typeof COLUMNS[];
  data: LocalDataSource = new LocalDataSource();

  testData = [
    {
      goodsWarehouse: false,
      validated: false,
      contributingResult: '',
      nameGoodGrouper: 1345,
      warehouse: 'T09 Almacen',
      dateInitTime: '',
      dateEndTime: '',
      managementNumb: 8904647,
      reservedQuantity: 1,
      description: 'LLANTA',
      saeNumb: '',
      inventoryNumb: '000088893',
      fileType: 'ABANDONO',
      uniqueKey: '307-12-01-15',
      unitMeasure: 'PIEZA',
    },
  ];

  constructor(
    private bsModalRef: BsModalRef,
    private modalService: BsModalService
  ) {
    super();
    this.tableSettings = { ...this.settings, actions: false };
    this.tableSettings = {
      ...this.settings,
      actions: false,
      selectMode: 'multi',
    };
    this.tableSettings.columns = COLUMNS;
  }

  ngOnInit(): void {
    this.data.load(this.testData);
  }

  onUserRowSelect(rows: any) {
    rows.selected.length > 0
      ? (this.enableButton = true)
      : (this.enableButton = false);
    this.rowsSelected = rows.selected;
  }

  confirmValidation() {
    let config: ModalOptions = {
      initialState: {},
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(
      ConfirmValidationComponent,
      config
    );
    this.bsModalRef.content.event.subscribe((value: string) => {
      this.updateContributorResult(value);
    });
  }

  viewExpedient() {
    let config: ModalOptions = {
      initialState: {},
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(ViewExpedientComponent, config);
  }

  updateContributorResult(values: any) {
    let tempArray: any[] = [];
    this.rowsSelected.forEach((rowSelected: typeof COLUMNS) => {
      tempArray = this.testData.map((element: any) => {
        if (rowSelected.uniqueKey === element.uniqueKey) {
          element.contributingResult = values.contributingResult;
          element.validated = true;
        }
        return element;
      });
    });
    this.data.load(tempArray);
    this.rowsSelected = [];
  }
}

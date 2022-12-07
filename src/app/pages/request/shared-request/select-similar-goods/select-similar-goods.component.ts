import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { AddGoodsButtonComponent } from 'src/app/pages/request/shared-request/select-goods/add-goods-button/add-goods-button.component';
import { ViewFileButtonComponent } from 'src/app/pages/request/shared-request/select-goods/view-file-button/view-file-button.component';
import { COLUMNS1 } from './columns1';
import { COLUMNS2 } from './columns2';
import { ModalAssignGoodGrouperComponent } from './modal-assign-good-grouper/modal-assign-good-grouper.component';

@Component({
  selector: 'app-select-similar-goods',
  templateUrl: './select-similar-goods.component.html',
  styles: [],
})
export class SelectSimilarGoodsComponent extends BasePage implements OnInit {
  goodParams = new BehaviorSubject<ListParams>(new ListParams());
  selectedGoodParams = new BehaviorSubject<ListParams>(new ListParams());
  selectedGoods: any[] = [];
  goodTotalItems: number = 0;
  selectedGoodTotalItems: number = 0;
  goodColumns: any[] = [];
  selectedGoodColumns: any[] = [];
  goodSettings: any;
  selectedGoodSettings: any;
  selectedRows: any[] = [];
  data: LocalDataSource = new LocalDataSource();
  enableButtonToGroup: boolean = false;
  valueGoodGrouper: string;

  goodTestData = [
    {
      allocatorAssetName: '',
      taxpayerResult: 'tax',
      origin: 'Invenatarios A.',
      description: 'Candil Decorativo',
      key: '801-69-68-65-2',
      reservedAmount: '20',
      availableAmount: '12',
      destination: 'Admon',
      subInventory: '44',
      proceedingsNumb: 5443,
      transferRequestNumber: 334343,
      managementNumb: 605,
      inventoryNumb: 654,
    },
    {
      allocatorAssetName: '',
      taxpayerResult: 'tax',
      origin: 'Invenatarios B.',
      description: 'Candil Decorativo',
      key: '801-69-68-65-5',
      reservedAmount: '20',
      availableAmount: '12',
      destination: 'Admon',
      subInventory: '44',
      proceedingsNumb: 5443,
      transferRequestNumber: 334343,
      managementNumb: 605,
      inventoryNumb: 654,
    },
    {
      allocatorAssetName: '',
      taxpayerResult: 'tax',
      origin: 'Invenatarios C.',
      description: 'Candil Decorativo',
      key: '801-69-68-65-9',
      reservedAmount: '20',
      availableAmount: '12',
      destination: 'Admon',
      subInventory: '44',
      proceedingsNumb: 5443,
      transferRequestNumber: 334343,
      managementNumb: 605,
      inventoryNumb: 654,
    },
  ];

  constructor(
    private bsModalRef: BsModalRef,
    private modalService: BsModalService
  ) {
    super();
    this.goodSettings = { ...this.settings, actions: false };
    this.goodSettings.Update;
    this.selectedGoodSettings = {
      ...this.settings,
      actions: false,
      selectMode: 'multi',
    };
    this.goodSettings.columns = COLUMNS1;
    this.selectedGoodSettings.columns = COLUMNS2;
  }

  ngOnInit(): void {
    const self = this;
    this.goodSettings.columns = {
      addGood: {
        title: 'Agregar Bien',
        type: 'custom',
        sort: false,
        renderComponent: AddGoodsButtonComponent,
        onComponentInitFunction(instance: any, component: any = self) {
          instance.action.subscribe((row: any) => {
            component.openReserveModal(row);
          });
        },
      },
      viewFile: {
        title: 'Expediente',
        type: 'custom',
        sort: false,
        renderComponent: ViewFileButtonComponent,
        onComponentInitFunction(instance: any, component: any = self) {
          instance.action.subscribe((row: any) => {
            component.viewFile(row);
          });
        },
      },
      ...this.goodSettings.columns,
    };
    this.selectedGoodSettings.columns = {
      viewFile: {
        title: 'Expediente',
        type: 'custom',
        sort: false,
        renderComponent: ViewFileButtonComponent,
        onComponentInitFunction(instance: any, component: any = self) {
          instance.action.subscribe((row: any) => {
            component.viewFile(row);
          });
        },
      },
      ...this.selectedGoodSettings.columns,
    };
    this.data.load(this.goodTestData);
  }

  getGoods(filters: any) {
    //Llamar servicio para obtener bienes
    let columns = this.goodTestData;
    columns.forEach(c => {
      c = Object.assign({ addGood: '' }, { viewFile: '' }, c);
    });
    this.goodColumns = columns;
    this.goodTotalItems = this.goodColumns.length;
  }

  siabSearch() {}

  selectGoods(rows: any[]) {
    this.selectedGoods = rows;
  }

  removeGoods() {
    // this.alertQuestion(
    //   'question',
    //   '¿Desea eliminar los bienes seleccionados?',
    //   '',
    //   'Eliminar'
    // ).then(question => {
    //   if (question.isConfirmed) {
    //     this.selectedGoodColumns.forEach((g: any, i: number) => {
    //       this.selectedGoods.forEach((d: any, j: number) => {
    //         if (g.key == d.key) {
    //           this.selectedGoodColumns.splice(i, 1);
    //           this.selectedGoods.splice(j, 1);
    //         }
    //       });
    //     });
    //     this.selectedGoodColumns = [...this.selectedGoodColumns];
    //     this.selectedGoodTotalItems = this.selectedGoodColumns.length;
    //     console.log(this.selectedGoods, this.selectedGoodColumns);
    //   }
    // });
  }

  openModal() {
    let config: ModalOptions = {
      initialState: {},
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(
      ModalAssignGoodGrouperComponent,
      config
    );
    this.bsModalRef.content.event.subscribe((value: string) => {
      this.assignGoodGrouper(value);
    });
  }

  onUserRowSelect(e: any) {
    this.selectedRows = e.selected;
    this.enableButton(e.selected.length);
  }

  assignGoodGrouper(value: string) {
    let tempArray: any[] = [];
    this.selectedRows.forEach((row: any) => {
      tempArray = this.goodTestData.map(element => {
        if (row.key === element.key) {
          element.allocatorAssetName = value;
        }
        return element;
      });
    });
    this.enableButtonToGroup = false;
    this.data.load(tempArray);
  }

  // Habilita/Deshabilitar boton para asignar bien agrupador
  enableButton(numberRowsSelected: number) {
    numberRowsSelected > 0
      ? (this.enableButtonToGroup = true)
      : (this.enableButtonToGroup = false);
  }
}

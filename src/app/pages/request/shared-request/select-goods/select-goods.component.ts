import { Component, Input, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { RequestSiabFormComponent } from '../request-siab-form/request-siab-form.component';
import { AddGoodsButtonComponent } from './add-goods-button/add-goods-button.component';
import { ReserveGoodModalComponent } from './reserve-good-modal/reserve-good-modal.component';
import { SELECT_GOODS_COLUMNS } from './select-goods-columns';
import { ViewFileButtonComponent } from './view-file-button/view-file-button.component';

@Component({
  selector: 'app-select-goods',
  templateUrl: './select-goods.component.html',
  styles: [],
})
export class SelectGoodsComponent extends BasePage implements OnInit {
  goodParams = new BehaviorSubject<ListParams>(new ListParams());
  selectedGoodParams = new BehaviorSubject<ListParams>(new ListParams());
  selectedGoods: any[] = [];
  goodTotalItems: number = 0;
  selectedGoodTotalItems: number = 0;
  goodColumns: any[] = [];
  selectedGoodColumns: any[] = [];
  @Input() nombrePantalla: string = 'sinNombre';
  goodSettings = {
    ...TABLE_SETTINGS,
    actions: false,
  };
  selectedGoodSettings = {
    ...TABLE_SETTINGS,
    actions: false,
    selectMode: 'multi',
  };

  goodTestData = [
    {
      origin: 'INVENTARIOS',
      description: 'CANDIL DECORATIVO',
      key: '801-69-68-65-2',
      manageNo: 605,
      transferAmount: 2,
      transactionAmount: 60,
      reservedAmount: 20,
      availableAmount: 40,
      destination: 'Admon',
      fileNo: 141,
      transferRequestNo: 6882,
      saeNo: '',
    },
    {
      origin: 'INVENTARIOS',
      description: 'FOTOCOPIADORA',
      key: '550-A004-07-1',
      manageNo: 606,
      transferAmount: 1,
      transactionAmount: 70,
      reservedAmount: 20,
      availableAmount: -10,
      destination: 'Donados',
      fileNo: 141,
      transferRequestNo: 6882,
      saeNo: '',
    },
    {
      origin: 'INVENTARIOS',
      description: 'VEHÍCULO MARCA FORD',
      key: '401-009-04-17-0',
      manageNo: 401,
      transferAmount: 1,
      transactionAmount: 80,
      reservedAmount: 0,
      availableAmount: 80,
      destination: 'Donación',
      fileNo: 141,
      transferRequestNo: 4842,
      saeNo: '',
    },
  ];

  constructor(private modalService: BsModalService) {
    super();
    this.goodSettings.columns = SELECT_GOODS_COLUMNS;
    this.selectedGoodSettings.columns = SELECT_GOODS_COLUMNS;
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
  }

  getGoods(filters: any) {
    console.log(filters);
    //Llamar servicio para obtener bienes
    let columns = this.goodTestData;
    columns.forEach(c => {
      c = Object.assign({ addGood: '' }, { viewFile: '' }, c);
    });
    this.goodColumns = columns;
    this.goodTotalItems = this.goodColumns.length;
  }

  viewFile(file: any) {}

  openReserveModal(good: any) {
    const modalRef = this.modalService.show(ReserveGoodModalComponent, {
      initialState: { good },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onReserve.subscribe((data: boolean) => {
      if (data) this.addGood(data);
    });
  }

  addGood(good: any) {
    console.log(good);
    delete good.addGood;
    good = Object.assign({ viewFile: '' }, good);
    this.selectedGoodColumns = [...this.selectedGoodColumns, good];
    this.selectedGoodTotalItems = this.selectedGoodColumns.length;
  }

  selectGoods(rows: any[]) {
    this.selectedGoods = rows;
  }

  removeGoods() {
    this.alertQuestion(
      'question',
      '¿Desea eliminar los bienes seleccionados?',
      '',
      'Eliminar'
    ).then(question => {
      if (question.isConfirmed) {
        this.selectedGoodColumns.forEach((g: any, i: number) => {
          this.selectedGoods.forEach((d: any, j: number) => {
            if (g.key == d.key) {
              this.selectedGoodColumns.splice(i, 1);
              this.selectedGoods.splice(j, 1);
            }
          });
        });
        this.selectedGoodColumns = [...this.selectedGoodColumns];
        this.selectedGoodTotalItems = this.selectedGoodColumns.length;
        console.log(this.selectedGoods, this.selectedGoodColumns);
      }
    });
  }

  openSiabSearch() {
    const modalRef = this.modalService.show(RequestSiabFormComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }
}

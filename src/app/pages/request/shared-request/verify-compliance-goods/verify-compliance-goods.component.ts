import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CheckVerifyComplianceComponent } from './check-verify-compliance/check-verify-compliance.component';

@Component({
  selector: 'app-verify-compliance-goods',
  templateUrl: './verify-compliance-goods.component.html',
  styles: [],
})
export class VerifyComplianceGoodsComponent extends BasePage implements OnInit {
  toggleInformation: boolean = true;
  @Input() nombrePantalla: string = 'sinNombre';
  @Output() onChange = new EventEmitter<any>();

  tableSettings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      descriptionGood: { title: 'Descripción', type: 'text', sort: false }, // TEXTO
      goodId: { title: 'No. Gestión', type: 'number', sort: false }, // NUMEROS
      transfereeId: {
        title: 'No. Solicitud Transferencia',
        type: 'number',
        sort: false,
      }, // NUMEROS
      subinventory: { title: 'Sub. Inventario', type: 'text', sort: false },
      meetsArticle24: {
        title: 'Cumple Articulo 24',
        type: 'custom',
        sort: false,
        valuePrepareFunction: (cell: any, row: any) => cell,
        onComponentInitFunction: (instance: any) => {
          instance.checkId = 'meetsArticle24';
        },
        renderComponent: CheckVerifyComplianceComponent,
      },
      meetsArticle28: {
        title: 'Cumple Articulo 28',
        type: 'custom',
        sort: false,
        valuePrepareFunction: (cell: any, row: any) => cell,
        onComponentInitFunction: (instance: any) => {
          instance.checkId = 'meetsArticle28';
        },
        renderComponent: CheckVerifyComplianceComponent,
      },
      meetsArticle29: {
        title: 'Cumple Articulo 29',
        type: 'custom',
        sort: false,
        valuePrepareFunction: (cell: any, row: any) => cell,
        onComponentInitFunction: (instance: any) => {
          instance.checkId = 'meetsArticle29';
        },
        renderComponent: CheckVerifyComplianceComponent,
      },
    },
  };

  data = [];
  requestId: number = null;
  process = null;
  editable: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private rejectedGoodService: RejectedGoodService
  ) {
    super();
  }

  ngOnInit() {
    this.requestId = Number(this.route.snapshot.paramMap.get('request'));
    this.process = this.route.snapshot.paramMap.get('process');

    this.editable = this.process != 'approve-return';

    this.getGoods();
  }

  userSelectRows(event: any) {
    //console.log(event);
    this.onChanges();
    // this.selected = event;
  }

  getGoods() {
    const param = new FilterParams();
    param.addFilter('applicationId', this.requestId);
    const filter = param.getParams();
    this.rejectedGoodService.getAll(filter).subscribe({
      next: response => {
        this.data = response.data;
        this.data.forEach(element => {
          element.meetsArticle24 = element.meetsArticle24 == '1';
          element.meetsArticle28 = element.meetsArticle28 == '1';
          element.meetsArticle29 = element.meetsArticle29 == '1';
        });
        this.onChanges();
      },
      error: error => { },
    });
  }

  onChanges() {
    this.onChange.emit({
      isValid:
        this.data.filter(
          x => x.meetsArticle24
            && x.meetsArticle28
            && x.meetsArticle29)
          .length == this.data.length,
      object: this.data,
    });
  }

  save() {
    this.data
      .filter(x => x.change)
      .forEach(element => {
        const body: any = {
          meetsArticle24: element.meetsArticle24 ? 1 : 0,
          meetsArticle28: element.meetsArticle28 ? 1 : 0,
          meetsArticle29: element.meetsArticle29 ? 1 : 0,
        };

        element.change = false;

        this.updateGood(element.goodresdevId, body);
      });

    this.onLoadToast(
      'success',
      'Se guardo la verificación de cumplimiento de los bienes'
    );
    this.onChanges();
  }

  cancel() {
    this.data.forEach(element => {
      element.change = true;
      element.meetsArticle24 = 0;
      element.meetsArticle28 = 0;
      element.meetsArticle29 = 0;
    });

    this.data = [...this.data];
  }

  updateGood(id, body: any) {
    return new Promise((resolve, reject) => {
      this.rejectedGoodService.updateGoodsResDev(id, body).subscribe({
        next: res => {
          resolve(true);
        },
        error: error => {
          reject(false);
          this.onLoadToast('error', 'No se pudieron actualizar los Bienes');
        },
      });
    });
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { CheckVerifyComplianceComponent } from './check-verify-compliance/check-verify-compliance.component';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { ActivatedRoute } from '@angular/router';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';

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
      descriptionGood: { title: 'Descripción', type: 'text' }, // TEXTO
      goodId: { title: 'No. Gestión', type: 'number' }, // NUMEROS
      transfereeId: {
        title: 'No. Solicitud Transferencia',
        type: 'number',
      }, // NUMEROS
      subinventory: { title: 'Sub. Inventario', type: 'text' },
      cumpleArticulo24: {
        title: 'Cumple Articulo 24',
        type: 'custom',
        valuePrepareFunction: (cell: any, row: any) => cell,
        onComponentInitFunction: (instance: any) => {
          instance.checkId = 'cumpleArticulo24';
        },
        renderComponent: CheckVerifyComplianceComponent,
      },
      cumpleArticulo28: {
        title: 'Cumple Articulo 28',
        type: 'custom',
        valuePrepareFunction: (cell: any, row: any) => cell,
        onComponentInitFunction: (instance: any) => {
          instance.checkId = 'cumpleArticulo28';
        },
        renderComponent: CheckVerifyComplianceComponent,
      },
      cumpleArticulo29: {
        title: 'Cumple Articulo 29',
        type: 'custom',
        valuePrepareFunction: (cell: any, row: any) => cell,
        onComponentInitFunction: (instance: any) => {
          instance.checkId = 'cumpleArticulo29';
        },
        renderComponent: CheckVerifyComplianceComponent,
      },
    },
  };

  data = [];
  requestId: number = null;
  process = null;

  constructor(
    private route: ActivatedRoute,
    private rejectedGoodService: RejectedGoodService,
  ) {
    super();
  }

  ngOnInit() {

    this.requestId = Number(this.route.snapshot.paramMap.get('request'));
    this.process = this.route.snapshot.paramMap.get('process');

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
        this.onChanges();
      },
      error: error => { },
    });

  }

  onChanges() {
    this.onChange.emit({
      isValid: false,
      object: this.data,
    });
  }

}

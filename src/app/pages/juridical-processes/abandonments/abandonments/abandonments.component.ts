/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ListParams } from '../../../../common/repository/interfaces/list-params';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { LabelGoodService } from 'src/app/core/services/catalogs/label-good.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-abandonments',
  templateUrl: './abandonments.component.html',
  styleUrls: ['./abandonments.component.scss'],
})
export class AbandonmentsComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  public form: FormGroup;
  selectRegDele = new DefaultSelect<any>();
  estatus: any = '';
  cantidad: any = '';
  destino: any = '';
  descripcion: any = '';
  unidad: any = '';
  clasificacion: any = '';
  constructor(
    private token: AuthService,
    private fb: FormBuilder,
    private readonly goodServices: GoodService,
    private readonly historyGoodService: HistoryGoodService,
    private statusGoodService: StatusGoodService,
    private goodSssubtypeService: GoodSssubtypeService,
    private labelGoodService: LabelGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    // this.listGoodsId(new ListParams());
    this.prepareForm();
    this.loading = true;
  }

  listGoodsId(params?: ListParams) {
    console.log('PARAMAS.', params);
    params['filter.goodId'] = `$eq:${params.text}`;
    // params['filter.description'] = `$ilike:${params.text}`;
    delete params['search'];

    this.goodServices.getAll(params).subscribe({
      next: (data: any) => {
        data.data.map((data: any) => {
          let descripcion = data.description == null ? '' : data.description;
          data.descriptionAndId = `${data.id} - ${descripcion} `;
          return data;
        }),
          console.log('RESP', data);

        this.selectRegDele = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.onLoadToast('warning', error.error.message, '');
        this.selectRegDele = new DefaultSelect();
      },
    });
  }

  private prepareForm() {
    this.form = this.fb.group({
      noBien: ['', [Validators.pattern(STRING_PATTERN), Validators.required]],
      descripcion: [''],
      cantidad: [''],
      estatus: [''],
      clasificacion: [''],
      destino: [''],
      unidad: [''],
    });
  }

  getGood(item: any) {
    this.loading = true;
    console.log('ITEM', item);

    if (item != undefined) {
      let id = item.goodId;
      let obj = {
        propertyNum: id,
        status: 'ABN',
      };

      this.historyGoodService.getHistoryStatusGoodById(obj).subscribe({
        next: response => {
          if (response) {
            this.onLoadToast(
              'warning',
              'Aplicación de Abandono',
              'El Bien previamente ha tenido un estatus de Abandono'
            );
            this.cleanForm();
          }
        },
        error: error => {
          this.loading = false;
          this.statusGood(item);
          this.getGoodSssubtypeService(item);
          this.getEtiqueta(item);
          this.cantidad = item.quantity;
          this.unidad = item.unit;
          this.descripcion = item.description;
          // this.form.get('estatus').setValue(item.status);
          // this.form.get('cantidad').setValue(item.quantity);
          // this.form.get('destino').setValue(item.destiny);
          // this.form.get('descripcion').setValue(item.description);
          // this.form.get('unidad').setValue(item.unit);
          // this.form.get('clasificacion').setValue(item.clarification);
        },
      });
    } else {
      this.cleanForm();
    }
  }

  cleanForm() {
    this.form.get('noBien').setValue('');
    this.cantidad = '';
    this.unidad = '';
    this.descripcion = '';
    this.estatus = '';
    this.destino = '';
    this.clasificacion = '';

    // this.form.get('estatus').setValue('');
    // this.form.get('cantidad').setValue('');
    // this.form.get('destino').setValue('');
    // this.form.get('descripcion').setValue('');
    // this.form.get('unidad').setValue('');
    // this.form.get('clasificacion').setValue('');
  }

  btnAplicaAbandono() {
    const historyGood: IHistoryGood = {
      propertyNum: this.form.get('noBien').value,
      status: 'ABN',
      changeDate: new Date(),
      userChange: this.token.decodeToken().preferred_username,
      statusChangeProgram: 'FABANDONOS',
      reasonForChange: 'Automático de Abandono',
      registryNum: null,
      extDomProcess: null,
    };

    this.historyGoodService.create(historyGood).subscribe({
      next: response => {
        this.cleanForm();

        this.onLoadToast(
          'success',
          'Aplicación de Abandono',
          'El Abandono ha sido aplicado'
        );
        this.loading = false;
        this.selectRegDele = new DefaultSelect();
      },
      error: error => {
        this.alert('error', error.error.message, 'Aplicación de Abandono');
        this.loading = false;
      },
    });
  }
  // ESTATUS_BIEN
  statusGood(good: any) {
    let params = new ListParams();
    params['filter.status'] = `$eq:${good.status}`;
    this.statusGoodService.getAll(params).subscribe({
      next: (response: any) => {
        const data = response.data[0];
        console.log('a', response);
        this.estatus = good.status + ' - ' + data.description;
        this.loading = false;
      },
      error: err => {
        this.estatus = '';
        this.loading = false;
      },
    });
  }
  // CAT_SSSUBTIPO_BIEN
  getGoodSssubtypeService(good: any) {
    let params = new ListParams();
    params['filter.numClasifGoods'] = `$eq:${good.goodClassNumber}`;
    this.goodSssubtypeService.getAll(params).subscribe({
      next: (response: any) => {
        const data = response.data[0];
        console.log('b', response);
        this.clasificacion = good.goodClassNumber + ' - ' + data.description;
        this.loading = false;
      },
      error: err => {
        this.clasificacion = '';
        this.loading = false;
      },
    });
  }
  // CAT_ETIQUETA_BIEN
  getEtiqueta(good: any) {
    let params = new ListParams();
    params['filter.id'] = `$eq:${good.labelNumber}`;
    this.labelGoodService.getEtiqXClasif(params).subscribe({
      next: (response: any) => {
        const data = response.data[0];
        console.log('c', response);
        this.destino = good.labelNumber + ' - ' + data.description;
        this.loading = false;
      },
      error: err => {
        this.destino = '';
        this.loading = false;
      },
    });
  }
}

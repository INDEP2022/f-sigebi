import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DETAILS_OI_COLUMNS } from './reclass-recovery-orders-columns';

@Component({
  selector: 'app-reclass-recovery-orders',
  templateUrl: './reclass-recovery-orders.component.html',
  styles: [],
})
export class ReclassRecoveryOrdersComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  selectedOI: any = null;
  OItems = new DefaultSelect();

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...DETAILS_OI_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getOI({ page: 1, text: '' });
  }
  private prepareForm() {
    this.form = this.fb.group({
      id: [null, [Validators.required]],
      // idArea: ['', [Validators.required]],
      // ur: ['', [Validators.required]],
      // clientRFC: ['', [Validators.required]],
      // descripRFC: ['', [Validators.required]],
      // anexo: ['', [Validators.required]],
      // tiPe: ['', [Validators.required]],
      // idEvent: ['', [Validators.required]],
      // concept: ['', [Validators.required]],
      // idBank: ['', [Validators.required]],
      // ordenDate: ['', [Validators.required]],
      // numovto: ['', [Validators.required]],
      // amount: ['', [Validators.required]],
      // reference: ['', [Validators.required]],
      // idPayment: ['', [Validators.required]],
    });
  }

  //Datos prueba de tabla
  dataTable = [
    {
      lote: 'lote 1',
      descripcion: 'descripción del lote 1',
      mandato: 'Mandato 1',
      importe: '100',
      importeSinIva: '16',
    },
    {
      lote: 'lote 2',
      descripcion: 'descripción del lote 2',
      mandato: 'Mandato 2',
      importe: '100',
      importeSinIva: '16',
    },
    {
      lote: 'lote 3',
      descripcion: 'descripción del lote 3',
      mandato: 'Mandato 3',
      importe: '100',
      importeSinIva: '16',
    },
  ];

  //Datos de prueba para autorrellenar los campos
  data: any[] = [
    {
      id: 1933,
      idArea: 182000,
      ur: 182000,
      clientRFC: 'MNA000314EX7',
      descripRFC: 'Tyrone González',
      anexo: 'PANTALLA BANCARIA',
      tiPe: 2,
      idEvent: 13,
      concept:
        'DEPÓSITO POR VENTA DE BIENES, EVENTO DECBM0207 SIN DESCRIPCIÓNDEPÓSITO POR VENTA DE BIENES, EVENTO DECBM0207 SIN DESCRIPCIÓNDEPÓSITO POR VENTA DE BIENES, EVENTO DECBM0207 SIN DESCRIPCIÓNDEPÓSITO POR VENTA DE BIENES, EVENTO DECBM0207 SIN DESCRIPCIÓNDEPÓSITO POR VENTA DE BIENES, EVENTO DECBM0207 SIN DESCRIPCIÓN',
      idBank: 6968940,
      ordenDate: 20070328,
      numovto: 18,
      amount: 5000,
      reference: 'LB204000000010975L06',
      idPayment: 1407,
    },
    {
      id: 1478,
      idArea: 218000,
      ur: 11000,
      clientRFC: 'ZQA000741EZ8',
      descripRFC: 'Ignacio Fornés Olmo',
      anexo: 'PANTALLA BANCARIA',
      tiPe: 1,
      idEvent: 12,
      concept: 'DEPÓSITO POR VENTA DE BIENES, EVENTO KSHW13247 SIN DESCRIPCIÓN',
      idBank: 3268951,
      ordenDate: 121370123,
      numovto: 11,
      amount: 3230,
      reference: 'LB104000000010975L07',
      idPayment: 714,
    },
    {
      id: 3214,
      idArea: 987000,
      ur: 987000,
      clientRFC: 'PAL0003149O7',
      descripRFC: 'Benito Antonio Martínez Ocasio',
      anexo: 'PANTALLA BANCARIA',
      tiPe: 1,
      idEvent: 32,
      concept: 'DEPÓSITO POR VENTA DE BIENES, EVENTO MAYBCD078 SIN DESCRIPCIÓN',
      idBank: 745896,
      ordenDate: 10254789,
      numovto: 12,
      amount: 6010,
      reference: 'LB980000000094517L06',
      idPayment: 8041,
    },
  ];

  getOI(params: ListParams) {
    if (params.text == '') {
      this.OItems = new DefaultSelect(this.data, 3);
    } else {
      const id = parseInt(params.text);
      const item = [this.data.filter((i: any) => i.id == id)];
      this.OItems = new DefaultSelect(item[0], 1);
    }
  }

  selectOI(event: any) {
    this.selectedOI = event;
  }
}

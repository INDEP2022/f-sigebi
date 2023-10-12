import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { MsInvoiceService } from 'src/app/core/services/ms-invoice/ms-invoice.service';
import { BasePage } from 'src/app/core/shared';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

@Component({
  selector: 'app-billing-screen',
  templateUrl: './billing-screen.component.html',
  styles: [``],
})
export class BillingScreenComponent extends BasePage implements OnInit {
  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  form: FormGroup = new FormGroup({});
  form2: FormGroup = new FormGroup({});

  columnFilters: any = [];
  constructor(
    private fb: FormBuilder,
    private msInvoiceService: MsInvoiceService
  ) {
    super();

    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: {
        // name: {
        //   filter: false,
        //   sort: false,
        //   title: 'Selección',
        //   type: 'custom',
        //   showAlways: true,
        //   valuePrepareFunction: (isSelected: boolean, row: any) =>
        //     this.isBillingSelected(row),
        //   renderComponent: CheckboxElementComponent,
        //   onComponentInitFunction: (instance: CheckboxElementComponent) =>
        //     this.onBillingSelect(instance),
        // },
        eventId: {
          title: 'Evento',
          type: 'string',
          sort: false,
          width: '10%',
        },
        batchId: {
          title: 'Lote',
          type: 'string',
          sort: false,
          width: '10%',
        },
        vouchertype: {
          title: 'Tipo',
          type: 'string',
          sort: false,
          width: '10%',
        },
        series: {
          title: 'Serie',
          type: 'string',
          sort: false,
          width: '15%',
        },
        folioinvoiceId: {
          title: 'Folio',
          type: 'string',
          sort: false,
          width: '10%',
        },
        factstatusId: {
          title: 'Estatus',
          type: 'string',
          sort: false,
          width: '10%',
        },
        customer: {
          title: 'Cliente',
          type: 'string',
          sort: false,
          width: '30%',
        },
        delegationNumber: {
          title: 'No.',
          type: 'string',
          sort: false,
          width: '10%',
        },
        desDelegation: {
          title: 'Delegación',
          type: 'string',
          sort: false,
          width: '20%',
        },
        cvman: {
          title: 'Mandato',
          type: 'string',
          sort: false,
        },
        downloadcvman: {
          title: 'Denominación',
          type: 'string',
          sort: false,
        },
        txtDescTipo: {
          title: 'Factura para',
          type: 'string',
          sort: false,
        },
        impressionDate: {
          title: 'Fecha',
          type: 'string',
          sort: false,
        },
        payId: {
          title: 'Id. Pago',
          type: 'string',
          sort: false,
        },
        relationshipSatType: {
          title: 'Tipo Rel.',
          type: 'string',
          sort: false,
        },
        usecompSat: {
          title: 'Uso comp.',
          type: 'string',
          sort: false,
        },
        paymentformBsat: {
          title: 'F. Pago',
          type: 'string',
          sort: false,
        },
        numBiasSat: {
          title: 'Parc.',
          type: 'string',
          sort: false,
        },
      },
    };
  }
  selectedbillings: any;
  onBillingSelect(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.billingSelectedChange(data.row, data.toggle),
    });
  }
  isBillingSelected(_billing: any) {
    const exists = this.selectedbillings.find(
      (billing: any) => billing.id == _billing.id
    );
    return !exists ? false : true;
  }
  billingSelectedChange(billing: any, selected: boolean) {
    if (selected) {
      this.selectedbillings.push(billing);
    } else {
      this.selectedbillings = this.selectedbillings.filter(
        (_billing: any) => _billing.id != billing.id
      );
    }
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              eventId: () => (searchFilter = SearchFilter.EQ),
              batchId: () => (searchFilter = SearchFilter.EQ),
              vouchertype: () => (searchFilter = SearchFilter.ILIKE),
              series: () => (searchFilter = SearchFilter.EQ),
              folioinvoiceId: () => (searchFilter = SearchFilter.ILIKE),
              factstatusId: () => (searchFilter = SearchFilter.ILIKE),
              customer: () => (searchFilter = SearchFilter.EQ),
              delegationNumber: () => (searchFilter = SearchFilter.EQ),
              desDelegation: () => (searchFilter = SearchFilter.ILIKE),
              cvman: () => (searchFilter = SearchFilter.EQ),
              downloadcvman: () => (searchFilter = SearchFilter.EQ),
              txtDescTipo: () => (searchFilter = SearchFilter.ILIKE),
              impressionDate: () => (searchFilter = SearchFilter.EQ),
              payId: () => (searchFilter = SearchFilter.EQ),
              relationshipSatType: () => (searchFilter = SearchFilter.EQ),
              usecompSat: () => (searchFilter = SearchFilter.EQ),
              paymentformBsat: () => (searchFilter = SearchFilter.ILIKE),
              numBiasSat: () => (searchFilter = SearchFilter.ILIKE),
            };
            search[filter.field]();

            if (filter.search !== '') {
              // this.columnFilters[field] = `${filter.search}`;
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              // this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          //Su respectivo metodo de busqueda de datos
          this.getBillings();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getBillings());
    this.prepareForm();
  }
  private prepareForm() {
    this.form = this.fb.group({
      idEvent: [null, Validators.pattern(NUMBERS_PATTERN)],
      idLotPublic: [null],
      date: [null],
      cause: [null],
      descause: [null],
      fec: [null],
      fec2: [null],
    });
    this.form2 = this.fb.group({
      counter: [null],
      counter2: [null],

      order: [null],
      xLote: [null],

      amountE: [null],
      amountI: [null],

      ivaE: [null],
      ivaI: [null],

      totalE: [null],
      totalI: [null],

      total8: [null],
      total7: [null],
      total3: [null],

      txtErrorRFC: [null],
      legend1: [null],

      amountPay: [null],
      ivaPay: [null],
      totalPay: [null],
    });
  }

  getBillings() {
    this.loading = true;
    this.totalItems = 0;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.msInvoiceService.getAllBillings(params).subscribe({
      next: response => {
        console.log(response);

        // let result = response.data.map(async (item: any) => {
        //   // item['rfc'] = item.customers ? item.customers.rfc : null;
        // });
        // Promise.all(result).then(resp => {
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
        // });
      },
      error: error => {
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }
  rowsSelected(event: any) {}
  GEN_PREFAC_100() {
    // Prefacturar Fallo
    //
  }

  ACTUALIZA() {
    // Act Datos Fallo
    // PUP_ACT_DATOS ('F')
  }

  PUP_ACT_DATOS() {
    // GO_BLOCK('COMER_FACTURAS');
    // PK_COMER_FACTINM.F_VALIDA_USUARIO
    // c_REG:= PUF_USU_REG;
  }

  VISUALIZA() {
    // Visualiza Factura
    //   IF: COMER_FACTURAS.ID_EVENTO IS NULL THEN
    //   LIP_MENSAJE('Debe seleccionar algún Evento', 'A');
    //     RAISE FORM_TRIGGER_FAILURE;
    //   ELSE
    //   IMPRIME_REPORTE(: COMER_FACTURAS.TIPO, 2, NULL, 1);
    //     : COMER_FACTURAS.SELECCIONA := 'N';
    //  END IF;
  }

  CANCELA() {
    // Cancelar Factura
    // BEGIN
    //   IF: BLK_CTRL.CAUSA IS NULL THEN
    //   VISUALIZA_CANCELA_SINO(1); --muestras los campos de la causa
    //   GO_ITEM('BLK_CTRL.CAUSA');
    //   ELSE
    //   : BLK_DAT_CANC.ID_EVENTO := NULL;
    //     : BLK_DAT_CANC.TXT_CVE_PROCESO := NULL;
    //     : BLK_DAT_CANC.ID_LOTE := NULL;
    //     : BLK_DAT_CANC.TXT_DESC_LOTE := NULL;
    //     : BLK_DAT_CANC.NO_DELEGACION := NULL;
    //     : BLK_DAT_CANC.TXT_DELEGACION := NULL;
    //     : BLK_DAT_CANC.CVMAN := NULL;
    //     : BLK_DAT_CANC.TXT_CVMAN := NULL;
    //   GO_ITEM('BLK_DAT_CANC.ID_EVENTO');
    // END IF;
    //   END;
  }
  VISUALIZA_CANCELA_SINO(PSINO: number) {
    // IF PSINO = 1 THEN
    //     SET_ITEM_PROPERTY('BLK_CTRL.CAUSA', DISPLAYED, PROPERTY_TRUE);
    //     SET_ITEM_PROPERTY('BLK_CTRL.CAUSA', ENABLED, PROPERTY_TRUE);
    //     SET_ITEM_PROPERTY('BLK_CTRL.CAUSA', NAVIGABLE, PROPERTY_TRUE);
    //     SET_ITEM_PROPERTY('BLK_CTRL.DESCAUSA', DISPLAYED, PROPERTY_TRUE);
    //     SET_ITEM_PROPERTY('BLK_CTRL.DESCAUSA', ENABLED, PROPERTY_TRUE);
    //     SET_ITEM_PROPERTY('BLK_CTRL.REGCANC', DISPLAYED, PROPERTY_TRUE);
    //     SET_ITEM_PROPERTY('BLK_CTRL.REGCANC', ENABLED, PROPERTY_TRUE);
    //   ELSIF PSINO = 0 THEN
    //     GO_ITEM('BLK_CTRL.ID_EVENTO');
    //     SET_ITEM_PROPERTY('BLK_CTRL.CAUSA', DISPLAYED, PROPERTY_FALSE);
    //     SET_ITEM_PROPERTY('BLK_CTRL.DESCAUSA', DISPLAYED, PROPERTY_FALSE);
    //     SET_ITEM_PROPERTY('BLK_CTRL.REGCANC', DISPLAYED, PROPERTY_FALSE);
    //     --SET_ITEM_PROPERTY('FOLIO_SP', ENABLED, PROPERTY_FALSE);
    //     : BLK_CTRL.CAUSA    := NULL;
    //     : BLK_CTRL.DESCAUSA := NULL;
    //   END IF;
  }

  ATENCION() {
    // Atención a Clientes
    // IF PUF_MENSAJE_SI_NO('Se enviara el nuevo CFDI para Atención a Clientes, ¿desea continuar?: ') = 'S' THEN
    //   SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'BUSY');
    //   PUP_GENERA_RUTA3;
    //   IMPRIME_PAQUETE;
    //   SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'NORMAL');
    //   LIP_MENSAJE('el CFDI nuevo fue enviado...', 'C');
    // END IF;
    //   EXCEPTION
    // WHEN OTHERS THEN
    //   SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'NORMAL');
    //   LIP_MENSAJE('Al enviar el nuevo CFDI > ' || sqlerrm, 'S');
  }

  CFDI() {
    //Genera CFDI
    // DECLARE
    // SEL NUMBER(1) := 0;
    //   BEGIN
    //   SEL:= HAY_SELECCION;
    // IF SEL = 1  THEN-- VA AL LINK DE PARA GENERAR LOS XML Y SELLO
    //   Host(FA_URLWEB_FAC(: COMER_FACTURAS.ID_EVENTO), NO_SCREEN);
    //   ELSE
    //   FIRST_RECORD;
    //   SYNCHRONIZE;
    //   LIP_MENSAJE('No se tienen registros seleccionados.', 'S');
    // END IF;
    //   END;
  }

  FALLO() {
    // Actualiza a VEN
  }
}

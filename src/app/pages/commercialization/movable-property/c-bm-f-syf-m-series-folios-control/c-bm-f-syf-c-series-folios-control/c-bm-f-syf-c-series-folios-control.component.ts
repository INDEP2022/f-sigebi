import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { SERIES_FOLIOS_CONTROL_COLUMNS } from './series-folios-control-columns';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CBmFSyfMSeriesFoliosControlModalComponent } from '../c-bm-f-syf-m-series-folios-control-modal/c-bm-f-syf-m-series-folios-control-modal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { SERIES_FOLIOS_CONTROL_TYPE_EVENT_COLUMNS } from '../c-bm-f-syf-m-series-folios-control-modal/series-folios-control-type-event-columns';
import { SERIES_FOLIOS_CONTROL_SEPARATE_PAGES_COLUMNS } from '../c-bm-f-syf-m-series-folios-control-modal/series-folios-control-separate-pages-columns';

@Component({
  selector: 'app-c-bm-f-syf-c-series-folios-control',
  templateUrl: './c-bm-f-syf-c-series-folios-control.component.html',
  styles: [],
})
export class CBmFSyfCSeriesFoliosControlComponent
  extends BasePage
  implements OnInit
{
  settings1 = {
    ...this.settings,
    actions: false,
  };
  settings2 = {
    ...this.settings,
    actions: false,
  };

  form: FormGroup = new FormGroup([]);

  params = new BehaviorSubject<ListParams>(new ListParams());
  selectedCoord: any = null;
  coordItems = new DefaultSelect();

  columns: any[] = [];
  totalItems: number = 0;

  constructor(private modalService: BsModalService, private fb: FormBuilder) {
    super();
    this.settings1.columns = {...SERIES_FOLIOS_CONTROL_TYPE_EVENT_COLUMNS};
    this.settings2.columns = {...SERIES_FOLIOS_CONTROL_SEPARATE_PAGES_COLUMNS};

    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: "Acciones",
        position: "right",
        edit: true,
        delete: false,
      },
      columns: { ...SERIES_FOLIOS_CONTROL_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getCoord({ inicio: 1, text: '' });
  }

  private prepareForm(){
    this.form = this.fb.group({
      id: [null, [Validators.required]]
    })
  }

  //Datos de prueba para Tabla COORDINACIÓN
  data = [
    {
      id: '81',
      coord: '0',
      regional: 'OFICINAS CENTRALES',
      serie: 'H',
      foInicial: '13886',
      foFinal: '14200',
      validez: '10/11/2010',
      tipo: 'Factura',
      estatus: 'CER',
      totalFolios: '315',
      folRegistrados: '0',
      folUtilizados: '315',
      fecUsuario: 'GBLANCO',
      fecRegistro: '28/12/2009',
      direccion: 'M',
    },
    {
      id: '101',
      coord: '0',
      regional: 'OFICINAS CENTRALES',
      serie: 'E',
      foInicial: '35001',
      foFinal: '40000',
      validez: '10/11/2010',
      tipo: 'Factura',
      estatus: 'CER',
      totalFolios: '5000',
      folRegistrados: '0',
      folUtilizados: '5000',
      fecUsuario: 'VFIESCO',
      fecRegistro: '12/01/2010',
      direccion: '',
    },
    {
      id: '262',
      coord: '0',
      regional: 'OFICINAS CENTRALES',
      serie: 'INGRB',
      foInicial: '1',
      foFinal: '1000000',
      validez: '30/10/2023',
      tipo: 'Factura CFDI',
      estatus: 'ACT',
      totalFolios: '1000000',
      folRegistrados: '965350',
      folUtilizados: '34650',
      fecUsuario: 'GBLANCO',
      fecRegistro: '12/12/2011',
      direccion: 'M',
    },
  ];

  //Datos de prueba para Tabla EVENTO x SERIE
  data1 = [
    {
      evento: 'SUBASTA ELECTRÓNICA',
      comentario: '0',
    },
  ];

  //Datos de prueba para Tabla FOLIOS APARTADOS
  data2 = [
    {
      folio: '',
      apartado: '',
      usuarioRegistro: 'M',
      fechaRegsitro: '',
    },
  ];

  //Datos de prueba para SELECCIONAR
  data3: any[] = [
    {
      id: 0,
      name: '0 - OFICINAS CENTRALES',
    },
    {
      id: 1,
      name: '1 - COORD. REGIONAL TIJUANA',
    },
    {
      id: 2,
      name: '2 - COORD. REGIONAL HERMOSILLO',
    },    
  ]

  getCoord(params: ListParams) {
    if (params.text == '') {
      this.coordItems = new DefaultSelect(this.data3, 3);
    } else {
      const id = parseInt(params.text);
      const item = [this.data3.filter((i: any) => i.id == id)];
      this.coordItems = new DefaultSelect(item[0], 1);
    }
  }

  selectCoord(event: any) {
    this.selectedCoord = event;
  }

  //Rellena input con datos de la tabla

  getData() {
    this.loading = true;
    this.columns = this.data;
    this.totalItems = this.data.length;
    this.loading = false;
  }

  openModal(context?: Partial<CBmFSyfMSeriesFoliosControlModalComponent>) {
      const modalRef = this.modalService.show(CBmFSyfMSeriesFoliosControlModalComponent, {
        initialState: { ...context },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      });
      modalRef.content.refresh.subscribe(next => {
        if (next) this.getData();
      });
    }

  openForm(allotment?: any) {
    this.openModal({ allotment });

  }

  

  

}

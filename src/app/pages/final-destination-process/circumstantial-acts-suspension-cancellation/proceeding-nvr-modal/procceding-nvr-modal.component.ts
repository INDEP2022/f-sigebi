import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import {
  IBlkBienvnr,
  IBlkBieVrnDto,
  ProceedingSusPcancelService,
} from 'src/app/core/services/ms-proceedings/proceeding-suspcancel.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { Columns, goodCheck } from './columns';

@Component({
  selector: 'app-procceding-nvr-modal',
  templateUrl: './procceding-nvr-modal.component.html',
  styleUrls: [],
})
export class ProceedingNVRModalComponent extends BasePage implements OnInit {
  isLoading = false;
  data = new LocalDataSource();

  override settings = {
    ...this.settings,
    columns: Columns,
    actions: false,
  };

  form: FormGroup;
  eventData = new DefaultSelect();
  filterData = new DefaultSelect([
    { value: 1, label: 'LOTE_PUBLICO' },
    { value: 2, label: 'CLIENTE' },
    { value: 3, label: 'CFDI' },
  ]);

  constructor(
    private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private comerEventsService: ComerEventosService,
    private proceedingSusCanService: ProceedingSusPcancelService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.searchEvents();
  }

  close() {
    this.bsModalRef.hide();
  }

  initForm() {
    this.form = this.fb.group({
      events: [null, Validators.required],
      filter: [null, Validators.required],
      value: [null, Validators.required],
    });
  }

  searchEvents(e?: any) {
    const paramsF = new FilterParams();

    if (e) {
      paramsF.page = e.page;

      if (e.search != '') {
        if (!isNaN(e.search)) {
          paramsF.addFilter('id', e.search);
        } else {
          paramsF.addFilter('processKey', e.search, SearchFilter.LIKE);
        }
      }
    }

    this.comerEventsService.listComerEvent(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        const newData = res.data.map(item => {
          return {
            ...item,
            bindLabel: item.id + ' - ' + item.processKey,
          };
        });
        this.eventData = new DefaultSelect(newData, res.count);
      },
      err => {
        console.log(err);
      }
    );
  }

  generalSearching() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alert('warning', 'Favor de llenar todos los campos', '');
      return;
    }

    const body: IBlkBienvnr = {
      filterBy: this.form.get('filter').value.value,
      eventId: this.form.get('events').value.id,
      searchValue: this.form.get('value').value,
    };

    this.proceedingSusCanService.searchBievnr(body).subscribe(
      res => {
        console.log(res);
        this.data.load(res.data);
      },
      err => {
        this.alert(
          'error',
          'Error al buscar',
          'Se presentó un error inesperado'
        );
        console.log(err);
      }
    );
  }

  sendGoods() {
    console.log(goodCheck);
    if (goodCheck.length === 0) {
      this.alert('warning', 'Favor de seleccionar al menos un bien', '');
      return;
    }

    let body: IBlkBieVrnDto[] = [];

    goodCheck.forEach((good, i) => {
      const goodBody: IBlkBieVrnDto = {
        goodNumber: good.BLK_BIEVNR_NO_BIEN,
        classificationNumber: good.BLK_BIEVNR_NO_CLASIF,
        diDescriptionProperty: good.BLK_BIEVNR_DI_DESC_BIEN,
        processExtDom: good.BLK_BIEVNR_PROCESO_EXT_DOM,
        amount: good.BLK_BIEVNR_CANTIDAD,
        unitM: good.BLK_BIEVNR_UNIDADM,
      };

      body.push(goodBody);
    });

    console.log(body);

    this.proceedingSusCanService
      .insertGoodsFactcircun({ BLK_BIEVNR: body })
      .subscribe(
        res => {
          console.log(res);
          this.alert('success', 'Bienes insertados correctamente', '');
          this.bsModalRef.content.callback(true);
          this.bsModalRef.hide();
        },
        err => {
          console.log(err);
          if (err.message == 'null') {
            this.alert('warning', 'No se pudieron insertar los bienes', '');
            return;
          }
          this.alert('error', 'Error al insertar bienes', '');
        }
      );
  }
}

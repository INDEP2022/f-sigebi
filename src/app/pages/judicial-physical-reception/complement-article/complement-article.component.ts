import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addDays, format } from 'date-fns';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { maxDate } from 'src/app/common/validations/date.validators';
import { IAppraisersGood } from 'src/app/core/models/good/good.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IRequestAppraisal } from 'src/app/core/models/ms-request-appraisal/request-appraisal.model';
import { AppraisersService } from 'src/app/core/services/catalogs/appraisers.service';
import { ProeficientService } from 'src/app/core/services/catalogs/proficient.service';
import { DynamicCatalogService } from 'src/app/core/services/dynamic-catalogs/dynamic-catalogs.service';
import { AppraisalGoodService } from 'src/app/core/services/ms-appraisal-good/appraisal-good.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { RequestAppraisalService } from 'src/app/core/services/ms-request-appraisal/request-appraisal.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from '../../../shared/components/select/default-select';
import { AppraisalHistoryComponent } from './appraisal-history/appraisal-history.component';

@Component({
  selector: 'app-complement-article',
  templateUrl: './complement-article.component.html',
  styleUrls: ['complement-article.component.scss'],
})
export class ComplementArticleComponent extends BasePage implements OnInit {
  settings1 = {
    ...TABLE_SETTINGS,
    rowClassFunction: (row: { data: { available: any } }) =>
      row.data.available ? 'available' : 'not-available',
    actions: false,
    columns: {
      id: {
        title: 'No. Bien',
        type: 'number',
        sort: false,
      },
      description: {
        title: 'Descripción',
        type: 'string',
        sort: false,
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  form: FormGroup;
  itemsSelect = new DefaultSelect();
  proeficientSelect = new DefaultSelect();
  institutionSelect = new DefaultSelect();
  currencySelect = new DefaultSelect();
  dataGoods = new LocalDataSource();
  dataGoodsSave: any[];
  statusScreen: any[];
  goodDataSave: any;
  dataApprasialGood: any[];
  idGood: number | string;
  goodSelected: string = 'No se seleccionó bien';
  getgoodCategory: string;
  getoriginSignals: string;
  getnotifyDate: string | Date;
  getnotifyA: string;
  getplaceNotify: string;
  getfechaDictamen: Date | string;
  getdictamenPerenidad: string;
  getdictamenPerito: string;
  getdictamenInstitucion: string;
  monedaField = 'moneda';
  dateVigencia: Date;
  isEnableGood = false;

  constructor(
    private fb: FormBuilder,
    private serviceGood: GoodService,
    private serviceProeficient: ProeficientService,
    private serviceInstitutionAppraiser: AppraisersService,
    private render: Renderer2,
    private serviceDynamicCat: DynamicCatalogService,
    private serviceAppraiser: AppraisalGoodService,
    private modalService: BsModalService,
    private serviceReqAppr: RequestAppraisalService,
    private serviceScreenStatus: ScreenStatusService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getStatusView();
  }

  prepareForm() {
    this.form = this.fb.group({
      expediente: [null, [Validators.required]],
      fechaFe: [null, [Validators.required]],
      noBien: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
      clasificacion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      remarks: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      solicitud: [null, [Validators.required]],
      importe: [null, [Validators.required]],
      moneda: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      fechaVigencia: [null, [Validators.required]],
      fechaAvaluo: [null, [Validators.required, maxDate(new Date())]],
      perito: [null, [Validators.required]],
      institucion: [null, [Validators.required]],
      fechaDictamen: [null, [Validators.required]],
      dictamenPerito: [null, [Validators.required]],
      dictamenInstitucion: [null, [Validators.required]],
      dictamenPerenidad: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      fechaAseg: [null, [Validators.required]],
      notificado: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      lugar: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
  }

  add() {
    this.openModal();
  }

  fillContent() {}

  openModal(context?: Partial<AppraisalHistoryComponent>) {
    const modalRef = this.modalService.show(AppraisalHistoryComponent, {
      initialState: {
        parentModal: 'Hola desde padre',
        appraisalData: this.dataApprasialGood,
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  validarFechaAvaluo() {
    this.btnAppraisTab();
    this.dateVigencia = addDays(this.form.get('fechaAvaluo').value, 1);
    this.enableButton('fecha-vigencia-input');
  }

  //Activar y desactivar Botones

  toggleButton(idBtn: string, data: string) {
    const tab = document.getElementById('tabset-id');
    const btn = document.getElementById(idBtn);
    if (this.form.get(data).value != null) {
      this.render.removeClass(btn, 'disabled');
      this.render.addClass(btn, 'enabled');
    } else {
      this.render.removeClass(btn, 'enabled');
      this.render.addClass(btn, 'disabled');
    }
  }

  enableButton(idBtn: string) {
    const btn = document.getElementById(idBtn);

    this.render.removeClass(btn, 'disabled');
    this.render.addClass(btn, 'enabled');
  }

  disabledButton(idBtn: string) {
    const btn = document.getElementById(idBtn);

    this.render.removeClass(btn, 'enabled');
    this.render.addClass(btn, 'disabled');
  }

  btnGeneralTab() {
    if (
      (this.form.get('clasificacion').value != this.getgoodCategory ||
        this.form.get('remarks').value != this.getoriginSignals) &&
      this.idGood != undefined &&
      this.idGood != null
    ) {
      this.enableButton('update-general-good');
    } else {
      this.disabledButton('update-general-good');
    }
  }

  btnAppraisTab() {
    if (
      this.form.get('fechaAvaluo').value == null ||
      this.form.get('fechaVigencia').value == null ||
      this.form.get('importe').value == null ||
      this.form.get('moneda').value == null ||
      this.form.get('perito').value == null ||
      this.form.get('institucion').value == null ||
      this.form.get('fechaAvaluo').value == '' ||
      this.form.get('fechaVigencia').value == '' ||
      this.form.get('importe').value == '' ||
      this.form.get('moneda').value == '' ||
      this.form.get('perito').value == '' ||
      this.form.get('institucion').value == '' ||
      this.idGood == undefined ||
      this.idGood == null
    ) {
      this.disabledButton('apprais-good');
    } else {
      this.enableButton('apprais-good');
    }
  }

  btnAbandonment() {
    if (
      (this.form.get('fechaAseg').value != this.getnotifyDate ||
        this.form.get('notificado').value != this.getnotifyA ||
        this.form.get('lugar').value != this.getplaceNotify) &&
      this.idGood != undefined &&
      this.idGood != null
    ) {
      this.enableButton('first-notice-abandonment');
    } else {
      this.disabledButton('first-notice-abandonment');
    }
  }

  btnOpinion() {
    const dateString = this.form.get('fechaDictamen').value;
    const formatString = 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ [(]z[)]';
    const isValidDateFormat = moment(dateString, formatString, true).isValid();
    if (
      ((isValidDateFormat
        ? moment(dateString).format('DD-MM-YYYY')
        : dateString) != this.getfechaDictamen ||
        this.form.get('dictamenPerito').value != this.getdictamenPerito ||
        this.form.get('dictamenInstitucion').value !=
          this.getdictamenInstitucion ||
        this.form.get('dictamenPerenidad').value !=
          this.getdictamenPerenidad) &&
      this.idGood != undefined &&
      this.idGood != null
    ) {
      this.enableButton('opinion');
    } else {
      this.disabledButton('opinion');
    }
  }

  //Catalogos

  getCurrency(params: ListParams) {
    const paramsF = new FilterParams();
    paramsF.addFilter('otValue01', params.text, SearchFilter.ILIKE);
    this.serviceDynamicCat.getCurrency(3, params).subscribe(
      res => {
        this.currencySelect = new DefaultSelect(res.data, res.count);
      },
      err => {
        console.log(err);
      }
    );
  }

  getInstitutions(param: ListParams) {
    this.serviceInstitutionAppraiser.getAll(param).subscribe(
      res => {
        this.institutionSelect = new DefaultSelect(res.data, res.count);
      },
      err => {
        console.log(err);
      }
    );
  }

  getProeficients(param: ListParams) {
    this.serviceProeficient.getAll(param).subscribe(
      res => {
        this.proeficientSelect = new DefaultSelect(res.data, res.count);
      },
      err => {
        console.log(err);
      }
    );
  }

  //Obtener bienes de un expediente

  getGoodsByExpedient() {
    this.serviceGood
      .getByExpedient(this.form.get('expediente').value, {
        text: '?expedient=',
      })
      .subscribe({
        next: async (res: any) => {
          const newData = await Promise.all(
            res.data.map(async (e: any) => {
              if (this.statusScreen.includes(e.status)) {
                return (e = { ...e, available: true });
              } else {
                return (e = { ...e, available: false });
              }
            })
          );
          this.dataGoods.load(newData);
        },
        error: (err: any) => {
          console.error(err);
        },
      });
  }

  //Datos generales del bien

  fillFormData(res: any, idForm: string) {
    res != null
      ? this.form.get(idForm).setValue(res)
      : this.form.get(idForm).setValue('');
  }

  getStatusView() {
    const paramsF = new FilterParams();
    paramsF.addFilter('screenKey', 'FACTREFAVALUOBIEN');
    paramsF.limit = 100;
    this.serviceScreenStatus.getAllFiltered(paramsF.getParams()).subscribe(
      res => {
        const statusScreen = JSON.parse(JSON.stringify(res.data)).map(
          (e: any) => e.status.status
        );
        this.statusScreen = statusScreen;
      },
      err => {
        console.log(err);
      }
    );
  }

  getGoodData(object: any) {
    if (object.data.available) {
      const id = object.data.id;
      this.serviceGood.getById(id).subscribe(
        res => {
          console.log(JSON.parse(JSON.stringify(res)).data);
          const data = JSON.parse(JSON.stringify(res)).data[0];
          this.goodDataSave = data;
          this.goodSelected = data.description;
          this.idGood = data.id;
          this.getgoodCategory = data.goodCategory;
          this.getoriginSignals = data.originSignals;
          this.getnotifyDate = moment(data.notifyDate).format('DD-MM-YYYY');
          this.getnotifyA = data.notifyA;
          this.getplaceNotify = data.placeNotify;
          this.getfechaDictamen = moment(data.dateOpinion).format('DD-MM-YYYY');
          this.getdictamenPerenidad = data.opinion;
          this.getdictamenPerito = data.proficientOpinion;
          this.getdictamenInstitucion = data.valuerOpinion;
          this.getAppraisalGood();
          this.fillFormData(data.goodCategory, 'clasificacion');
          this.fillFormData(data.originSignals, 'remarks');
          data.dateOpinion != null
            ? this.form
                .get('fechaDictamen')
                .setValue(moment(data.dateOpinion).format('DD-MM-YYYY'))
            : this.form.get('fechaDictamen').setValue('');
          this.fillFormData(data.proficientOpinion, 'dictamenPerito');
          this.fillFormData(data.valuerOpinion, 'dictamenInstitucion');
          this.fillFormData(data.opinion, 'dictamenPerenidad');
          data.notifyDate != null
            ? this.form
                .get('fechaAseg')
                .setValue(moment(data.notifyDate).format('DD-MM-YYYY'))
            : this.form.get('fechaAseg').setValue('');
          this.fillFormData(data.notifyA, 'notificado');
          this.fillFormData(data.placeNotify, 'lugar');
        },
        err => {
          console.log(err);
        }
      );
    } else {
      this.disabledButton('update-general-good');
      this.disabledButton('apprasial-history');
      this.disabledButton('apprais-good');
      this.disabledButton('opinion');
      this.disabledButton('first-notice-abandonment');
      this.isEnableGood = false;
    }
  }

  enabledGroup() {}

  updateGoodData() {
    if (!this.isEnableGood) {
      this.alert(
        'error',
        'Error en el tipo de bien',
        'Esta intentando registrar en un bien con un tipo no valido'
      );
    } else {
      const updateData: IGood = {
        id: parseInt(this.idGood.toString()),
        goodId: parseInt(this.idGood.toString()),
        goodCategory: this.form.get('clasificacion').value,
        originSignals: this.form.get('remarks').value,
      };
      this.serviceGood.updateWithoutId(updateData).subscribe(
        res => {
          console.log('Modificado');
          this.disabledButton('update-general-good');
          this.getgoodCategory = updateData.goodCategory;
          this.getoriginSignals = updateData.originSignals;
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  updateOpinion() {
    if (!this.isEnableGood) {
      this.alert(
        'error',
        'Error en el tipo de bien',
        'Esta intentando registrar en un bien con un tipo no valido'
      );
    } else {
      const opinionData: IGood = {
        id: parseInt(this.idGood.toString()),
        goodId: parseInt(this.idGood.toString()),
        dateOpinion: this.form.get('fechaDictamen').value,
        proficientOpinion: this.form.get('dictamenPerito').value,
        valuerOpinion: this.form.get('dictamenInstitucion').value,
        opinion: this.form.get('dictamenPerenidad').value,
      };
      this.serviceGood.updateWithoutId(opinionData).subscribe(
        res => {
          console.log('Modificado');
          this.disabledButton('opinion');
          this.getfechaDictamen = opinionData.dateOpinion;
          this.getdictamenPerenidad = opinionData.opinion;
          this.getdictamenPerito = opinionData.proficientOpinion;
          this.getdictamenInstitucion = opinionData.valuerOpinion;
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  updateNotify() {
    if (!this.isEnableGood) {
      this.alert(
        'error',
        'Error en el tipo de bien',
        'Esta intentando registrar en un bien con un tipo no valido'
      );
    } else {
      const notifyData = {
        id: parseInt(this.idGood.toString()),
        goodId: parseInt(this.idGood.toString()),
        notifyDate: new Date(this.form.get('fechaAseg').value),
        notifyA: this.form.get('notificado').value.trim(),
        placeNotify: this.form.get('lugar').value.trim(),
      };
      this.serviceGood.updateWithoutId(notifyData).subscribe(
        res => {
          console.log('Modificado');
          this.disabledButton('first-notice-abandonment');
          this.getnotifyDate = notifyData.notifyDate;
          this.getnotifyA = notifyData.notifyA;
          this.getplaceNotify = notifyData.placeNotify;
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  //Datos de valuo de un bien

  getAppraisalGood() {
    console.log('Sí entró');
    if (this.idGood != '' && this.idGood != null && this.idGood != undefined) {
      const paramsF = new FilterParams();
      paramsF.addFilter('noGood', this.idGood);
      this.serviceAppraiser
        .getAppraisalGood(paramsF.getParams())
        .subscribe(res => {
          this.dataApprasialGood = res.data;
          this.enableButton('apprasial-history');
        });
    }
  }

  postAppraisGood() {
    let dataAG: IAppraisersGood = {
      noGood: this.idGood,
      appraisalDate: this.form.get('fechaAvaluo').value,
      effectiveDate: this.form.get('fechaVigencia').value,
      valueAppraisal: this.form.get('importe').value,
      noRequest: '1234',
    };

    const rxa: IRequestAppraisal = {
      requestDate: format(new Date(), 'yyyy-MM-dd'),
      requestType: 'E',
      cveCurrencyAppraisal: this.form.get('moneda').value,
      cveCurrencyCost: this.form.get('moneda').value,
      noExpert: this.form.get('perito').value.id,
      noAppraiser: this.form.get('institucion').value.id,
    };
    if (
      this.form.get('fechaAvaluo').value > this.form.get('fechaVigencia').value
    ) {
    } else {
      this.serviceReqAppr.postRequestAppraisal(rxa).subscribe(
        res => {
          const id = JSON.parse(JSON.stringify(res)).id;
          dataAG.noRequest = id;
          this.serviceAppraiser.postAppraisalGood(dataAG).subscribe(
            res => {
              console.log(res);
              this.getAppraisalGood();
              this.form.get('fechaAvaluo').setValue('');
              this.form.get('fechaVigencia').setValue('');
              this.form.get('importe').setValue('');
              this.form.get('moneda').setValue('');
              this.form.get('perito').setValue('');
              this.form.get('institucion').setValue('');
            },
            err => {
              console.log(err);
            }
          );
        },
        err => {
          console.log(err);
        }
      );
    }
  }
}

import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IAppraisersGood } from 'src/app/core/models/good/good.model';
import { AppraisersService } from 'src/app/core/services/catalogs/appraisers.service';
import { ProeficientService } from 'src/app/core/services/catalogs/proficient.service';
import { DynamicCatalogService } from 'src/app/core/services/dynamic-catalogs/dynamic-catalogs.service';
import { AppraisalGoodService } from 'src/app/core/services/ms-appraisal-good/appraisal-good.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from '../../../shared/components/select/default-select';
import { AppraisalHistoryComponent } from './appraisal-history/appraisal-history.component';

@Component({
  selector: 'app-complement-article',
  templateUrl: './complement-article.component.html',
  styles: [],
})
export class ComplementArticleComponent implements OnInit {
  form: FormGroup;
  itemsSelect = new DefaultSelect();
  proeficientSelect = new DefaultSelect();
  institutionSelect = new DefaultSelect();
  currencySelect = new DefaultSelect();
  dataGoods: any[];
  goodDataSave: any;
  dataApprasialGood: any[];
  idGood: string | number = '';
  goodSelected: string = 'No se seleccionó bien';
  getgoodCategory: string;
  getoriginSignals: string;
  getnotifyDate: string | Date;
  getnotifyA: string;
  getplaceNotify: string;
  getfechaDictamen: string;
  getdictamenPerenidad: string;
  getdictamenPerito: string;
  getdictamenInstitucion: string;

  constructor(
    private fb: FormBuilder,
    private serviceGood: GoodService,
    private serviceProeficient: ProeficientService,
    private serviceInstitutionAppraiser: AppraisersService,
    private render: Renderer2,
    private serviceDynamicCat: DynamicCatalogService,
    private serviceAppraiser: AppraisalGoodService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
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
      fechaAvaluo: [null, [Validators.required]],
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
      this.idGood != '' &&
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
      this.form.get('institucion').value == ''
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
      this.idGood != '' &&
      this.idGood != undefined &&
      this.idGood != null
    ) {
      this.enableButton('first-notice-abandonment');
    } else {
      this.disabledButton('first-notice-abandonment');
    }
  }

  btnOpinion() {
    console.log(this.form.get('dictamenPerenidad').value);
    console.log(this.getdictamenPerenidad);
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
      this.idGood != '' &&
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
        console.log(res);
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
        next: (res: any) => {
          this.dataGoods = res.data;
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

  getGoodData(id: number) {
    this.serviceGood.getById(id).subscribe(
      res => {
        this.goodDataSave = res;
        this.goodSelected = res.description;
        this.idGood = res.id;
        this.getgoodCategory = res.goodCategory;
        this.getoriginSignals = res.originSignals;
        this.getnotifyDate = moment(res.notifyDate).format('DD-MM-YYYY');
        this.getnotifyA = res.notifyA;
        this.getplaceNotify = res.placeNotify;
        this.getfechaDictamen = moment(res.dateOpinion).format('DD-MM-YYYY');
        this.getdictamenPerenidad = res.opinion;
        this.getdictamenPerito = res.proficientOpinion;
        this.getdictamenInstitucion = res.valuerOpinion;
        this.getAppraisalGood();
        this.fillFormData(res.goodCategory, 'clasificacion');
        this.fillFormData(res.originSignals, 'remarks');
        res.dateOpinion != null
          ? this.form
              .get('fechaDictamen')
              .setValue(moment(res.dateOpinion).format('DD-MM-YYYY'))
          : this.form.get('fechaDictamen').setValue('');
        this.fillFormData(res.proficientOpinion, 'dictamenPerito');
        this.fillFormData(res.valuerOpinion, 'dictamenInstitucion');
        this.fillFormData(res.opinion, 'dictamenPerenidad');
        res.notifyDate != null
          ? this.form
              .get('fechaAseg')
              .setValue(moment(res.notifyDate).format('DD-MM-YYYY'))
          : this.form.get('fechaAseg').setValue('');
        this.fillFormData(res.notifyA, 'notificado');
        this.fillFormData(res.placeNotify, 'lugar');
      },
      err => {
        console.log(err);
      }
    );
  }

  updateGoodData() {
    const updateData = {
      goodCategory: this.form.get('clasificacion').value,
      originSignals: this.form.get('remarks').value,
    };
    console.log(updateData);
    this.serviceGood.update(this.idGood, updateData).subscribe(
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

  updateOpinion() {
    const formatString = 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ [(]z[)]';
    const opinionData = {
      dateOpinion: moment(this.form.get('fechaDictamen').value).format(
        formatString
      ),
      proficientOpinion: this.form.get('dictamenPerito').value.name,
      valuerOpinion: this.form.get('dictamenInstitucion').value.description,
      opinion: this.form.get('dictamenPerenidad').value,
    };
    /*  this.serviceGood.update(this.idGood, opinionData).subscribe(
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
    ); */
  }

  updateNotify() {
    const notifyData = {
      notifyDate: this.form.get('fechaAseg').value,
      notifyA: this.form.get('notificado').value,
      placeNotify: this.form.get('lugar').value,
    };
    this.serviceGood.update(this.idGood, notifyData).subscribe(
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

  //Datos de valuo de un bien

  getAppraisalGood() {
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
      requestXAppraisal: {
        cveCurrencyAppraisal: this.form.get('moneda').value,
        noExpert: this.form.get('perito').value.id,
        noAppraiser: this.form.get('institucion').value.id,
      },
    };

    console.log(dataAG);
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
  }
}

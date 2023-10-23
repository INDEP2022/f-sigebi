import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addDays, format } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { maxDate } from 'src/app/common/validations/date.validators';
import { IMoneda } from 'src/app/core/models/catalogs/tval-Table5.model';
import { IAppraisersGood } from 'src/app/core/models/good/good.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IRequestAppraisal } from 'src/app/core/models/ms-request-appraisal/request-appraisal.model';
import { AppraisersService } from 'src/app/core/services/catalogs/appraisers.service';
import { AppraisersHttpService } from 'src/app/core/services/catalogs/ms-appraisers.service';
import { ProeficientService } from 'src/app/core/services/catalogs/proficient.service';
import { TvalTable5Service } from 'src/app/core/services/catalogs/tval-table5.service';
import { DynamicCatalogService } from 'src/app/core/services/dynamic-catalogs/dynamic-catalogs.service';
import { AppraisalGoodService } from 'src/app/core/services/ms-appraisal-good/appraisal-good.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
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
    hideSubHeader: false,
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
  goodSelected: string = 'Seleccione un Bien';
  getgoodCategory: string;
  getoriginSignals: string;
  getnotifyDate: string | Date;
  getnotifyA: string;
  getplaceNotify: string;
  getfechaDictamen: Date | string;
  getdictamenPerenidad: string;
  getdictamenPerito: string;
  getdictamenInstitucion: string;
  getregisterInscrSol: boolean;
  monedaField = 'moneda';
  dateVigencia: Date;
  isEnableGood = false;
  goodStatus = '';
  params = new BehaviorSubject(new ListParams());
  totalItems: number = 0;
  columnFilters: any = [];
  data: LocalDataSource = new LocalDataSource();

  currencies = new DefaultSelect<IMoneda>([], 0);

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
    private serviceScreenStatus: ScreenStatusService,
    private serviceCatalogAppraise: AppraisersHttpService,
    private serviceExpediente: ExpedientService,
    private tableServ: TvalTable5Service
  ) {
    super();
    this.changePagin();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getStatusView();
    this.form.get('solicitud').valueChanges.subscribe(res => {
      //console.log('solicitud', res);
    });
    //if (this.form.get('expediente').value != null) {

    //}
  }

  changePagin() {
    this.dataGoods
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.EQ;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filters.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.EQ;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getGoodsByExpedient();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodsByExpedient());
  }

  prepareForm() {
    this.form = this.fb.group({
      expediente: [null, [Validators.required]],
      fechaFe: [null, []],
      noBien: [null, []],
      descripcion: [null, []],
      clasificacion: [null, [Validators.pattern(STRING_PATTERN)]],
      remarks: [null, [Validators.pattern(STRING_PATTERN)]],
      solicitud: [null, []],
      importe: [null, []],
      moneda: [null],
      fechaVigencia: [null, []],
      fechaAvaluo: [null, [maxDate(new Date())]],
      perito: [null, []],
      institucion: [null, []],
      fechaDictamen: [null, []],
      dictamenPerito: [null, []],
      dictamenInstitucion: [null, []],
      dictamenPerenidad: [null, [Validators.pattern(STRING_PATTERN)]],
      fechaAseg: [null, []],
      notificado: [null, [Validators.pattern(STRING_PATTERN)]],
      lugar: [null, [Validators.pattern(STRING_PATTERN)]],
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
        idGood: this.idGood,
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  validarFechaAvaluo() {
    /* this.btnAppraisTab(); */
    this.dateVigencia = addDays(this.form.get('fechaAvaluo').value, 1);
    this.enableButton('fecha-vigencia-input');
  }

  //Activar y desactivar Botones

  toggleButton(idBtn: string, data: string) {
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
    console.log('evento param ', param);
    const params = new ListParams();
    params['filter.description'] = `$ilike:${param.text}`;

    this.serviceInstitutionAppraiser.getAll(params).subscribe(
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

  clearInputs() {
    this.form.get('clasificacion').reset();
    this.form.get('remarks').reset();
    this.form.get('importe').reset();
    this.form.get('moneda').reset();
    this.form.get('fechaAvaluo').reset();
    this.form.get('fechaVigencia').reset();
    this.form.get('perito').reset();
    this.form.get('institucion').reset();
    this.form.get('fechaDictamen').reset();
    this.form.get('dictamenPerito').reset();
    this.form.get('dictamenInstitucion').reset();
    this.form.get('dictamenPerenidad').reset();
    this.form.get('fechaAseg').reset();
    this.form.get('notificado').reset();
    this.form.get('lugar').reset();
    /* this.disabledButton('first-notice-abandonment');
    this.disabledButton('opinion');
    this.disabledButton('apprais-good');
    this.disabledButton('apprasial-history');
    this.disabledButton('update-general-good'); */
    this.goodSelected = 'Seleccione un Bien';
    this.goodStatus = '';
    this.form.get('fechaFe').reset();
  }

  getGoodsByExpedient() {
    this.disabledButton('search-goods-expedient');
    this.clearInputs();
    this.params.getValue()['text'] = '?expedient=';
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.serviceGood
      .getByExpedient(this.form.get('expediente').value, params)
      .subscribe({
        next: async (res: any) => {
          console.log('resp ', res);
          console.log('resp total ', res.count);
          this.totalItems = res.count;
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
          this.enableButton('search-goods-expedient');
          console.log(
            "this.form.get('expediente').value ",
            this.form.get('expediente').value
          );
          this.serviceExpediente
            .getById(this.form.get('expediente').value)
            .subscribe(resp => {
              this.form
                .get('fechaFe')
                .setValue(
                  resp.ministerialDate === null
                    ? this.form.get('fechaFe').reset()
                    : new Date(resp.ministerialDate)
                );
            });
        },
        error: (err: any) => {
          console.error(err);
          this.totalItems = 0;
          this.dataGoods.load([]);
          this.alert(
            'warning',
            'El expediente presento error',
            'El número de expediente no existe o presentó un error inesperado'
          );
          this.enableButton('search-goods-expedient');
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

  deselectRow() {
    /* this.disabledButton('update-general-good');
    this.disabledButton('apprasial-history');
    this.disabledButton('apprais-good');
    this.disabledButton('opinion');
    this.disabledButton('first-notice-abandonment'); */
    this.isEnableGood = false;
    this.clearInputs();
  }

  getGoodData(object: any) {
    this.form.get('importe').reset();
    this.form.get('moneda').reset();
    this.form.get('fechaAvaluo').reset();
    this.form.get('fechaVigencia').reset();
    this.form.get('perito').reset();
    this.form.get('institucion').reset();

    if (object != null) {
      console.log('data valida ');
      this.isEnableGood = true;
    } else {
      console.log('data no valida ');
      /* this.disabledButton('update-general-good');
      this.disabledButton('apprasial-history');
      this.disabledButton('apprais-good');
      this.disabledButton('opinion');
      this.disabledButton('first-notice-abandonment'); */
      this.isEnableGood = false;
    }

    const id = object.data.id;

    let exp = this.form.get('expediente').value;
    console.log(id, ' - ', exp);
    console.log(' -> ', `${exp}?filter.goodId=$eq:${id}`);

    this.serviceGood
      .getByExpedient(`${exp}?filter.goodId=$eq:${id}`)
      .subscribe({
        next: async (res: any) => {
          console.log(JSON.parse(JSON.stringify(res)).data);
          const data = JSON.parse(JSON.stringify(res)).data[0];
          console.log('goodStatus -> ', data);
          this.goodDataSave = data;
          this.goodSelected = `Seleccionó el Bien con id: ${data.id}`;
          this.idGood = data.id;
          this.goodStatus = data.goodStatus;
          this.getgoodCategory = data.goodCategory;
          this.getoriginSignals = data.originSignals;
          console.log('data.dateOpinion ', data.dateOpinion);
          if (data.dateOpinion != null) {
            this.form.get('fechaDictamen').setValue(new Date(data.dateOpinion));
          } else {
            this.form.get('fechaDictamen').setValue('');
          }

          this.getnotifyA = data.notifyA || null;
          this.getplaceNotify = data.placeNotify;
          console.log('data.fechaAseg ', data.notifyDate);
          if (data.notifyDate != null) {
            this.form.get('fechaAseg').setValue(new Date(data.notifyDate));
          } else {
            this.form.get('fechaAseg').setValue(null);
          }

          this.getdictamenPerenidad = data.opinion;
          this.getdictamenPerito = data.proficientOpinion;
          this.getdictamenInstitucion = data.valuerOpinion;
          this.getregisterInscrSol =
            data.registerInscrSol === 'S' ? true : false;
          this.getExpedientGoog();
          this.getAppraisalGoodTab();
          this.fillFormData(data.goodCategory, 'clasificacion');
          this.fillFormData(this.getregisterInscrSol, 'solicitud');
          this.fillFormData(data.originSignals, 'remarks');

          // data.dateOpinion =  data.dateOpinion != null
          //    ? this.form
          //        .get('fechaDictamen')
          //        .setValue(this.formatDate(new Date(data.dateOpinion)))
          //    : this.form.get('fechaDictamen').setValue('');
          this.fillFormData(data.proficientOpinion, 'dictamenPerito');
          this.fillFormData(data.valuerOpinion, 'dictamenInstitucion');
          this.fillFormData(data.opinion, 'dictamenPerenidad');
          // data.notifyDate != null
          //   ? this.form
          //       .get('fechaAseg')
          //       .setValue(this.formatDate(new Date(data.notifyDate)))
          //   : this.form.get('fechaAseg').setValue('');
          this.fillFormData(data.notifyA, 'notificado');
          this.fillFormData(data.placeNotify, 'lugar');
          console.log('cargado ');
        },
        error: (err: any) => {
          console.error(err);

          this.alert(
            'warning',
            'Error al Consultar Bien',
            'El número de bien no existe o presentó un error inesperado'
          );
        },
      });
    /*   
    this.serviceGood.getById(id).subscribe(
      res => {

        console.log(JSON.parse(JSON.stringify(res)).data);
        const data = JSON.parse(JSON.stringify(res)).data[0];
        console.log(data.goodStatus);
        this.goodDataSave = data;
        this.goodSelected = `Seleccionó el Bien con id: ${data.id}`;
        this.idGood = data.id;
        this.goodStatus = data.goodStatus;
        this.getgoodCategory = data.goodCategory;
        this.getoriginSignals = data.originSignals;
        console.log('data.notifyDate ', data.notifyDate);
        this.getnotifyDate =
          data.notifyDate != null
            ? (this.getnotifyDate = this.formatDate(new Date(data.notifyDate)))
            : null;
        //this.getnotifyDate = format(data.notifyDate, 'dd-MM-yyyy');

        this.getnotifyA = data.notifyA || null;
        this.getplaceNotify = data.placeNotify;
        this.getfechaDictamen =
          data.dateOpinion != null
            ? this.formatDate(new Date(data.dateOpinion))
            : null;
        this.getdictamenPerenidad = data.opinion;
        this.getdictamenPerito = data.proficientOpinion;
        this.getdictamenInstitucion = data.valuerOpinion;
        this.getregisterInscrSol = data.registerInscrSol === 'S' ? true : false;
        this.getExpedientGoog();
        this.getAppraisalGoodTab();
        this.fillFormData(data.goodCategory, 'clasificacion');
        this.fillFormData(this.getregisterInscrSol, 'solicitud');
        this.fillFormData(data.originSignals, 'remarks');
        data.dateOpinion != null
          ? this.form
              .get('fechaDictamen')
              .setValue(this.formatDate(new Date(data.dateOpinion)))
          : this.form.get('fechaDictamen').setValue('');
        this.fillFormData(data.proficientOpinion, 'dictamenPerito');
        this.fillFormData(data.valuerOpinion, 'dictamenInstitucion');
        this.fillFormData(data.opinion, 'dictamenPerenidad');
        data.notifyDate != null
          ? this.form
              .get('fechaAseg')
              .setValue(this.formatDate(new Date(data.notifyDate)))
          : this.form.get('fechaAseg').setValue('');
        this.fillFormData(data.notifyA, 'notificado');
        this.fillFormData(data.placeNotify, 'lugar');
        console.log('cargado ');
      },

      err => {
        console.log(err);
      }
    ); */
  }

  /* updateGoodData() {
    if (!this.isEnableGood) {
      this.alert(
        'error',
        'Error en el tipo de bien',
        'Esta intentando registrar en un bien con un tipo no valido'
      );
    } else {
      if (
        !this.form.get('clasificacion').valid ||
        !this.form.get('remarks').valid
      ) {
        this.alert(
          'error',
          'Error en los campos',
          'Esta intentando actualizar el bien con campos inválidos'
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
            this.alert(
              'success',
              'Actualización exitosa',
              'Los datos fueron modificados con éxito'
            );
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
  } */

  /* updateOpinion() {
    if (!this.isEnableGood) {
      this.alert(
        'error',
        'Error en el tipo de bien',
        'Esta intentando registrar en un bien con un tipo no valido'
      );
    } else {
      if (
        !this.form.get('fechaDictamen').valid ||
        !this.form.get('dictamenPerito').valid ||
        !this.form.get('dictamenInstitucion').valid ||
        !this.form.get('dictamenPerenidad').valid
      ) {
        this.alert(
          'error',
          'Error en los campos',
          'Esta intentando actualizar el bien con campos inválidos'
        );
      } else {
        const opinionData: IGood = {
          id: parseInt(this.idGood.toString()),
          goodId: parseInt(this.idGood.toString()),
          dateOpinion: new Date(this.form.get('fechaDictamen').value),
          proficientOpinion: this.form.get('dictamenPerito').value.name,
          valuerOpinion: this.form.get('dictamenInstitucion').value.description,
          opinion: this.form.get('dictamenPerenidad').value,
        };
        console.log(opinionData);
        this.serviceGood.updateWithoutId(opinionData).subscribe(
          res => {
            this.alert(
              'success',
              'Actualización exitosa',
              'Los datos fueron modificados con éxito'
            );

            this.disabledButton('opinion');
            this.getfechaDictamen = opinionData.dateOpinion;
            this.getdictamenPerenidad = opinionData.opinion;
            this.getdictamenPerito = opinionData.proficientOpinion;
            this.getdictamenInstitucion = opinionData.valuerOpinion;
          },
          err => {
            console.log(err);
            this.alert(
              'error',
              'No se pudo registrar el dictamen',
              'Ocurrió un error inesperado que no permitió guardar el dictamen'
            );
          }
        );
      }
    }
  } */

  /* updateNotify() {
    if (!this.isEnableGood) {
      this.alert(
        'error',
        'Error en el tipo de bien',
        'Esta intentando registrar en un bien con un tipo no valido'
      );
    } else {
      if (
        !this.form.get('fechaAseg').valid ||
        !this.form.get('notificado').valid ||
        !this.form.get('notificado').valid
      ) {
        this.alert(
          'error',
          'Error en los campos',
          'Esta intentando actualizar el bien con campos inválidos'
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
            this.alert(
              'success',
              'Actualización exitosa',
              'Los datos fueron modificados con éxito'
            );

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
  } */

  updateGeneral() {
    if (!this.isEnableGood) {
      this.alert(
        'error',
        'Error en el tipo de bien',
        'Esta intentando registrar en un bien con un tipo no válido'
      );
    } else {
      /* this.postAppraisGood(); */
      const generalModel: IGood = {
        id: parseInt(this.idGood.toString()),
        goodId: parseInt(this.idGood.toString()),
        goodCategory: this.form.get('clasificacion').value.trim(),
        originSignals: this.form.get('remarks').value.trim(),
        dateOpinion: new Date(this.form.get('fechaDictamen').value),
        proficientOpinion: this.form.get('dictamenPerito').value.name,
        valuerOpinion: this.form.get('dictamenInstitucion').value.description,
        opinion: this.form.get('dictamenPerenidad').value.trim(),
        notifyDate: new Date(this.form.get('fechaAseg').value),
        notifyA: this.form.get('notificado').value.trim(),
        placeNotify: this.form.get('lugar').value.trim(),
        registerInscrSol: this.form.get('solicitud').value ? 'S' : null,
      };
      console.log('generalModel -> ', generalModel);
      this.serviceGood.updateWithoutId(generalModel).subscribe(
        res => {
          this.alert('success', 'Los datos fueron guardados', '');
        },
        err => {
          console.log(err);
          this.alert('error', 'Ocurrió un error inesperado', '');
        }
      );
    }
  }

  //Datos de valuo de un bien

  getExpedientGoog() {
    if (this.idGood != '' && this.idGood != null && this.idGood != undefined) {
      const paramsF = new FilterParams();
      let exp = this.form.get('expediente').value;
      paramsF.addFilter('noGood', this.idGood);
      paramsF['sortBy'] = 'noRequest:DESC';
      this.serviceGood
        .getByExpedientV2(exp, paramsF.getParams())
        .subscribe(res => {
          console.log('dataApprasialGood ', res);
          this.dataApprasialGood = res.data;
        });
    }
  }

  //evaluo origen
  getAppraisalGoodTab() {
    if (this.idGood != '' && this.idGood != null && this.idGood != undefined) {
      const paramsF = new FilterParams();
      paramsF.addFilter('noGood', this.idGood);
      paramsF['sortBy'] = 'noRequest:DESC';
      let exp =
        this.form.get('expediente').value +
        `&filter.noGood=$eq:${this.idGood}&filter.state=$eq:E`;

      //this.idGood
      //this.idGood = 54597100;
      //comentar
      this.serviceAppraiser
        .getAppraisalGoodV2(
          `?filter.noGood=$eq:${this.idGood}&filter.state=$eq:E`
        )
        .subscribe(res => {
          console.log('evaluo origen ', res);
          const resApprais = JSON.parse(JSON.stringify(res.data[0]));
          this.form.get('importe').setValue(resApprais.valueAppraisal);
          this.form
            .get('moneda')
            .setValue(
              resApprais.requestXAppraisal != undefined
                ? resApprais.requestXAppraisal.cveCurrencyAppraisal
                : null
            );
          if (resApprais.appraisalDate != undefined) {
            this.form
              .get('fechaAvaluo')
              .setValue(new Date(resApprais.appraisalDate));
          }

          if (resApprais.effectiveDate != undefined) {
            this.form
              .get('fechaVigencia')
              .setValue(new Date(resApprais.effectiveDate));
          }

          if (resApprais.requestXAppraisal != undefined) {
            this.serviceProeficient
              .getById(resApprais.requestXAppraisal.noExpert)
              .subscribe(
                res => {
                  this.form.get('perito').setValue(res);
                },
                err => {
                  this.form.get('perito').setValue(null);
                }
              );
          }
          //console.log(resApprais.requestXAppraisal.noAppraiser);
          if (resApprais.requestXAppraisal != undefined) {
            this.serviceCatalogAppraise
              .getById(resApprais.requestXAppraisal.noAppraiser)
              .subscribe(
                res => {
                  console.log('respuesta inst', res);
                  console.log(res.data[0]['description']);
                  this.form
                    .get('institucion')
                    .setValue(res.data[0]['description']);
                },
                err => {
                  this.form.get('institucion').setValue(null);
                }
              );
          }
          /* if (resApprais.requestXAppraisal != undefined) {
            this.form
              .get('institucion')
              .setValue(resApprais.requestXAppraisal.noAppraiser);
          } */
          //!Se necesita agregar filtro dinámico a este endpoint http://sigebimsdev.indep.gob.mx/catalog/api/v1/appraisers?filter.id=$eq:85
        });
    }
  }

  postAppraisGood() {
    console.log(this.form.get('institucion').value);
    console.log(this.form.get('perito').value);
    console.log(this.form.get('importe').value);
    if (!this.isEnableGood) {
    } else {
      //this.isEnableGood = true;
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
        noExpert:
          this.form.get('perito').value.id != undefined
            ? this.form.get('perito').value.id
            : null,
        noAppraiser:
          this.form.get('institucion').value.id != undefined
            ? this.form.get('institucion').value.id
            : null,
      };
      if (
        this.form.get('fechaAvaluo').value >
        this.form.get('fechaVigencia').value
      ) {
      } else {
        this.serviceReqAppr.postRequestAppraisal(rxa).subscribe(
          res => {
            const id = JSON.parse(JSON.stringify(res)).id;
            dataAG.noRequest = id;
            this.serviceAppraiser.postAppraisalGood(dataAG).subscribe(
              res => {
                this.alert('success', 'El Bien se avaluó', '');
                this.getExpedientGoog();
              },
              err => {
                console.log('Ocurrió un error');
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

  getCurrencies($params: ListParams) {
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    if ($params.text) params.search = $params.text;
    this.getRegCurrency(params);
  }

  getRegCurrency(_params?: FilterParams, val?: boolean) {
    // const params = new FilterParams();

    // params.page = _params.page;
    // params.limit = _params.limit;
    // if (val) params.addFilter3('filter.desc_moneda', _params.text);

    this.tableServ.getReg4WidthFilters(_params.getParams()).subscribe({
      next: data => {
        data.data.map(data => {
          data.desc_moneda = `${data.cve_moneda}- ${data.desc_moneda}`;
          return data;
        });
        this.currencies = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.currencies = new DefaultSelect();
      },
    });
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  }
}

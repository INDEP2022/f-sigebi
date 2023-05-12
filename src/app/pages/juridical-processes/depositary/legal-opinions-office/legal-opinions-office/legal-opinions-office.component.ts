import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ICopiesOfficialOpinion } from 'src/app/core/models/ms-dictation/copies-official-opinion.model';
import { IDictation } from 'src/app/core/models/ms-dictation/dictation-model';
import { IOfficialDictation } from 'src/app/core/models/ms-dictation/official-dictation.model';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { IJobDictumTexts } from 'src/app/core/models/ms-officemanagement/job-dictum-texts.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUM_POSITIVE, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { COLUMNS, officeTypeOption } from './columns';
import { LegalOpinionsOfficeService } from './services/legal-opinions-office.service';

export interface IParamsLegalOpinionsOffice {
  PAQUETE: string;
  P_GEST_OK: string;
  CLAVE_OFICIO_ARMADA: string;
  P_NO_TRAMITE: string;
  TIPO: string;
  P_VALOR: string;
}
@Component({
  selector: 'app-legal-opinions-office',
  templateUrl: './legal-opinions-office.component.html',
  styles: [],
})
export class LegalOpinionsOfficeComponent extends BasePage implements OnInit {
  data: any[] = [
    {
      number: 'Bien 1',
      description: 'Descripcion del bien 1',
      kitchenware: 'Menaje 1',
      quantityDict: '2.000',
      status: 'Estatus 1',
      ident: 'Ident 1',
      processes: 'Procesos 1',
    },
    {
      number: 'Bien 1',
      description: 'Descripcion del bien 1',
      kitchenware: 'Menaje 1',
      quantityDict: '2.000',
      status: 'Estatus 1',
      ident: 'Ident 1',
      processes: 'Procesos 1',
    },
    {
      number: 'Bien 1',
      description: 'Descripcion del bien 1',
      kitchenware: 'Menaje 1',
      quantityDict: '2.000',
      status: 'Estatus 1',
      ident: 'Ident 1',
      processes: 'Procesos 1',
    },
    {
      number: 'Bien 1',
      description: 'Descripcion del bien 1',
      kitchenware: 'Menaje 1',
      quantityDict: '2.000',
      status: 'Estatus 1',
      ident: 'Ident 1',
      processes: 'Procesos 1',
    },
  ];

  form: FormGroup;
  formScan: FormGroup;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  cityData = new DefaultSelect();
  issuingUser = new DefaultSelect();
  addressee = new DefaultSelect();
  userCopies1 = new DefaultSelect();
  userCopies2 = new DefaultSelect();
  expedientData: IExpedient;
  dictationData: IDictation;
  officeDictationData: IOfficialDictation;
  officeCopiesDictationData: ICopiesOfficialOpinion[] = [];
  officeTextDictationData: IJobDictumTexts;
  paramsScreen: IParamsLegalOpinionsOffice = {
    PAQUETE: '',
    P_GEST_OK: '',
    CLAVE_OFICIO_ARMADA: '',
    P_NO_TRAMITE: '',
    TIPO: '', //'PROCEDENCIA', // DEVOLUCION   ---  DESTRUCCION  --- EXP
    P_VALOR: '', //'486063', // --- EXP 791474  --  155--- EXP 5060   ---   5240--- EXP 339805
  };
  officeTypeOption: any[] = officeTypeOption;
  origin: string = '';
  moreInfo1: boolean = false;
  moreInfo2: boolean = false;
  moreInfo3: boolean = false;
  variables = {
    fecha: '',
    identi: '',
    cveActa: '',
    cveOficioArmada: '',
  };
  dictationTypeValidOption: string[] = [
    'PROCEDENCIA',
    'TRANSFERENTE',
    'DESTRUCCION',
    'DONACION',
    'ENAJENACION',
    'ABANDONO',
    'RESARCIMIENTO',
  ];
  showEnableTypeOffice: boolean = false;
  showScanForm: boolean = true;

  constructor(
    private fb: FormBuilder,
    private svLegalOpinionsOfficeService: LegalOpinionsOfficeService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.showEnableTypeOffice = false;
    this.showScanForm = true;
    this.buildForm();
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((params: any) => {
        for (const key in this.paramsScreen) {
          if (Object.prototype.hasOwnProperty.call(params, key)) {
            this.paramsScreen[key as keyof typeof this.paramsScreen] =
              params[key] ?? null;
          }
        }
        this.origin = params['origin'] ?? null;
        if (
          this.origin &&
          this.paramsScreen.TIPO != null &&
          this.paramsScreen.P_VALOR != null
        ) {
          this.btnSearchAppointment();
        }
        console.log(params, this.paramsScreen);
      });
    if (this.paramsScreen) {
      this.initForm();
    }
  }

  initForm() {
    if (this.paramsScreen.TIPO == 'RESARCIMIENTO') {
      this.form.get('cveOfficeGenerate').enable();
    } else {
      this.form.get('cveOfficeGenerate').disable();
    }
    //  SET VARIABLES
    if (
      this.variables.identi.includes('4') &&
      this.paramsScreen.TIPO == 'RESARCIMIENTO'
    ) {
      this.form.get('addressee').disable();
    }
    // this.btnSearchAppointment();
  }

  showMoreInformationField(show: boolean, option: number) {
    this.moreInfo1 = option == 1 ? show : false;
    this.moreInfo2 = option == 2 ? show : false;
    this.moreInfo3 = option == 3 ? show : false;
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      file: [{ value: '', disabled: false }, [Validators.maxLength(11)]],
      numberOfficeDic: [{ value: '', disabled: false }, [Validators.required]],
      typeOffice: [{ value: '', disabled: true }],
      cveOfficeGenerate: [{ value: '', disabled: true }, [Validators.required]],
      authorizedDic: [
        { value: '', disabled: false },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      issuingUser: [
        { value: null, disabled: false },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ], // SELECT
      name: [
        { value: '', disabled: false },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      addressee: [
        { value: null, disabled: false },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ], // SELECT
      nameAddressee: [
        { value: '', disabled: false },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      city: [
        { value: null, disabled: false },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ], // SELECT
      descriptionCity: [
        { value: '', disabled: false },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      introductoryParagraph: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ],
      finalParagraph: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ],
      moreInformation1: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ],
      moreInformation2: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ],
      moreInformation3: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ],
      numberNotary: [{ value: '', disabled: false }, [Validators.required]],
      ccp_person: [{ value: '', disabled: false }],
      ccp_addressee: [
        { value: null, disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ], // SELECT
      ccp_TiPerson: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ],
      ccp_person_1: [{ value: '', disabled: false }],
      ccp_addressee_1: [
        { value: null, disabled: false },
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ], // SELECT
      ccp_TiPerson_1: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
    });
    this.formScan = this.fb.group({
      scanningFoli: [
        { value: '', disabled: false },
        [Validators.pattern(NUM_POSITIVE), Validators.maxLength(11)],
      ],
    });
  }
  btnSearchAppointment() {
    this.loading = true;
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('typeDict', this.paramsScreen.TIPO);
    params.addFilter('id', this.paramsScreen.P_VALOR);
    // params['sortBy'] = 'nameCity:ASC';
    let subscription = this.svLegalOpinionsOfficeService
      .getDictations(params.getParams())
      .subscribe({
        next: data => {
          console.log('DICTAMEN', data);
          this.dictationData = data.data[0];
          this.setDataAppointment();
          subscription.unsubscribe();
          this.getOfficeDictationData();
          // Call dictaminaciones por bien
          if (
            this.dictationTypeValidOption.includes(
              this.dictationData.typeDict
            ) &&
            !this.variables.identi.includes('4')
          ) {
            this.form.get('typeOffice').enable();
            this.showEnableTypeOffice = true;
          }
        },
        error: error => {
          this.loading = false;
          console.log(error);
          subscription.unsubscribe();
        },
      });
  }

  setDataAppointment() {
    this.form
      .get('cveOfficeGenerate')
      .setValue(this.dictationData.passOfficeArmy);
    this.form.get('file').setValue(this.dictationData.expedientNumber);
    this.form.get('numberOfficeDic').setValue(this.dictationData.id);
    this.showScanForm = false;
    setTimeout(() => {
      this.formScan
        .get('scanningFoli')
        .setValue(this.dictationData.folioUniversal);
      this.formScan.get('scanningFoli').updateValueAndValidity();
      this.showScanForm = true;
    }, 200);
  }

  // SSF3_FIRMA_ELEC_DOCS
  getElectronicFirmData() {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('natureDocument', this.dictationData.typeDict);
    params.addFilter('documentNumber', this.dictationData.id);
    params.addFilter('documentType', this.dictationData.statusDict);
    let subscription = this.svLegalOpinionsOfficeService
      .getElectronicFirmData(params.getParams())
      .subscribe({
        next: data => {
          console.log('FIRMA ELECTRONICA', data);
          subscription.unsubscribe();
        },
        error: error => {
          console.log(error);
          subscription.unsubscribe();
        },
      });
  }
  getOfficeDictationData() {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('officialNumber', this.paramsScreen.P_VALOR);
    params.addFilter('typeDict', this.paramsScreen.TIPO);
    let subscription = this.svLegalOpinionsOfficeService
      .getOfficeDictation(params.getParams())
      .subscribe({
        next: data => {
          console.log('OFICIO DICTAMEN', data);
          this.officeDictationData = data.data[0];
          if (this.dictationData.passOfficeArmy) {
            if (
              this.officeDictationData.statusOf == 'ENVIADO' &&
              !this.dictationData.passOfficeArmy.toString().includes('?')
            ) {
              this.getElectronicFirmData();
            }
          }
          this.setDataOfficeDictation();
          this.getExpedientData();
          this.getOfficeCopiesDictation();
          this.getOfficeTextDictation();
          subscription.unsubscribe();
        },
        error: error => {
          this.loading = false;
          this.getExpedientData();
          console.log(error);
          subscription.unsubscribe();
        },
      });
  }
  setDataOfficeDictation() {
    this.form.get('issuingUser').setValue(this.officeDictationData.sender);
    this.form.get('addressee').setValue(this.officeDictationData.recipient);
    this.form.get('city').setValue(this.officeDictationData.city);
    this.form
      .get('numberNotary')
      .setValue(this.officeDictationData.notaryNumber);
    this.form
      .get('introductoryParagraph')
      .setValue(this.officeDictationData.text1);
    this.form.get('finalParagraph').setValue(this.officeDictationData.text2);
    this.form
      .get('moreInformation1')
      .setValue(this.officeDictationData.text2To);
    // Validar el texto3 de acuerdo al tipo de dictaminación
    this.officeDictationData =
      this.svLegalOpinionsOfficeService.getTexto3FromOfficeDictation(
        this.officeDictationData,
        this.form.get('typeOffice').value
      );
    this.form.get('moreInformation3').setValue(this.officeDictationData.text3);
    if (this.officeDictationData.statusOf == 'ENVIADO') {
      this.form.get('issuingUser').disable();
      this.form.get('addressee').disable();
      this.form.get('city').disable();
      this.form.get('numberNotary').disable();
    } else {
      this.form.get('issuingUser').enable();
      this.form.get('addressee').enable();
      this.form.get('city').enable();
      this.form.get('numberNotary').enable();
    }
    this.getCityByDetail(new ListParams(), true);
    this.getIssuingUserByDetail(new ListParams(), true);
    this.getAddresseeByDetail(new ListParams(), true);
  }

  getExpedientData() {
    let paramsData = new ListParams();
    paramsData['filter.id'] = '$eq:' + this.dictationData.expedientNumber; // 791474; //
    let subscription = this.svLegalOpinionsOfficeService
      .getExpedient(paramsData)
      .subscribe({
        next: data => {
          console.log('EXPEDIENTE', data);
          this.expedientData = data.data[0];
          subscription.unsubscribe();
          this.loading = false;
        },
        error: error => {
          this.loading = false;
          console.log(error);
          subscription.unsubscribe();
        },
      });
  }

  getOfficeCopiesDictation() {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('numberOfDicta', this.officeDictationData.officialNumber);
    params.addFilter('typeDictamination', this.officeDictationData.typeDict);
    let subscription = this.svLegalOpinionsOfficeService
      .getOfficeCopiesDictation(params.getParams())
      .subscribe({
        next: data => {
          console.log('OFICIO COPIAS DICTAMEN', data);
          this.officeCopiesDictationData = data.data;
          this.setDataOfficeCopiesDictation();
          subscription.unsubscribe();
        },
        error: error => {
          console.log(error);
          this.officeCopiesDictationData = null;
          subscription.unsubscribe();
        },
      });
  }

  setDataOfficeCopiesDictation() {
    this.officeCopiesDictationData.forEach((copiesData, index) => {
      console.log(copiesData);
      this.form
        .get('ccp_person' + (index == 0 ? '' : '_1'))
        .setValue(copiesData.personExtInt);
      if (copiesData.personExtInt == 'I') {
        this.form
          .get('ccp_addressee' + (index == 0 ? '' : '_1'))
          .setValue(copiesData.recipientCopy);
        this.form
          .get('ccp_addressee' + (index == 0 ? '' : '_1'))
          .updateValueAndValidity();
        setTimeout(() => {
          this.getUsersCopies(new ListParams(), index == 0 ? 1 : 2, true);
        }, 300);
      } else if (copiesData.personExtInt == 'E' && copiesData.namePersonExt) {
        this.form
          .get('ccp_TiPerson' + (index == 0 ? '' : '_1'))
          .setValue(copiesData.namePersonExt);
      }
    });
  }

  getOfficeTextDictation() {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('dictatesNumber', this.officeDictationData.officialNumber);
    params.addFilter('rulingType', this.officeDictationData.typeDict);
    let subscription = this.svLegalOpinionsOfficeService
      .getOfficeTextDictation(params.getParams())
      .subscribe({
        next: data => {
          console.log('OFICIO TEXTOS DICTAMEN', data);
          this.officeTextDictationData = data.data[0];
          this.setOfficeTextDictation();
          subscription.unsubscribe();
        },
        error: error => {
          console.log(error);
          this.officeTextDictationData = null;
          subscription.unsubscribe();
        },
      });
  }

  setOfficeTextDictation() {
    this.form
      .get('moreInformation2')
      .setValue(this.officeTextDictationData.textx);
  }

  getCityByDetail(paramsData: ListParams, getByValue: boolean = false) {
    console.log(paramsData);
    const params = new FilterParams();
    if (paramsData['search'] == undefined) {
      paramsData['search'] = '';
    }
    params.removeAllFilters();
    if (getByValue) {
      params.addFilter('idCity', this.form.get('city').value);
    } else {
      params.addFilter('nameCity', paramsData['search'], SearchFilter.LIKE);
    }
    params['sortBy'] = 'nameCity:ASC';
    console.log(params, paramsData);
    let subscription = this.svLegalOpinionsOfficeService
      .getCityByDetail(params.getParams())
      .subscribe({
        next: data => {
          this.cityData = new DefaultSelect(
            data.data.map(i => {
              i.nameAndId =
                '#' + i.idCity + ' -- ' + i.nameCity + ' -- ' + i.legendOffice;
              return i;
            }),
            data.count
          );
          console.log(data, this.cityData);
          subscription.unsubscribe();
        },
        error: error => {
          this.cityData = new DefaultSelect();
          subscription.unsubscribe();
        },
      });
  }
  getIssuingUserByDetail(paramsData: ListParams, getByValue: boolean = false) {
    const params = new FilterParams();
    if (paramsData['search'] == undefined) {
      paramsData['search'] = '';
    }
    params.removeAllFilters();
    if (getByValue) {
      params.addFilter('id', this.form.get('issuingUser').value);
    } else {
      params.addFilter('name', paramsData['search'], SearchFilter.LIKE);
    }
    params['sortBy'] = 'name:ASC';
    let subscription = this.svLegalOpinionsOfficeService
      .getIssuingUserByDetail(params.getParams())
      .subscribe({
        next: data => {
          this.issuingUser = new DefaultSelect(
            data.data.map(i => {
              i.name = '#' + i.id + ' -- ' + i.name;
              return i;
            }),
            data.count
          );
          console.log(data, this.issuingUser);
          subscription.unsubscribe();
        },
        error: error => {
          this.issuingUser = new DefaultSelect();
          subscription.unsubscribe();
        },
      });
  }

  changeAddreseeDetail(event: any) {
    console.log(event);
  }
  // DELEGACION Y DEPARTAMENTO EN DESTINATARIO
  getAddresseeByDetail(paramsData: ListParams, getByValue: boolean = false) {
    if (paramsData['search'] == undefined) {
      paramsData['search'] = '';
    }
    if (getByValue) {
      paramsData['filter.user'] = '$eq:' + this.form.get('addressee').value;
    } else {
      paramsData['filter.userDetail.name'] = '$ilike:' + paramsData['search'];
    }
    delete paramsData['text'];
    paramsData['sortBy'] = 'userDetail.name:ASC';
    let subscription = this.svLegalOpinionsOfficeService
      .getAddresseeByDetail(paramsData)
      .subscribe({
        next: data => {
          this.addressee = new DefaultSelect(
            data.data.map(i => {
              i['description'] = '#' + i.user + ' -- ' + i.userDetail.name;
              return i;
            }),
            data.count
          );
          console.log(data, this.addressee);
          subscription.unsubscribe();
        },
        error: error => {
          this.addressee = new DefaultSelect();
          subscription.unsubscribe();
        },
      });
  }

  getUsersCopies(
    paramsData: ListParams,
    ccp: number,
    getByValue: boolean = false
  ) {
    const params = new FilterParams();
    if (paramsData['search'] == undefined) {
      paramsData['search'] = '';
    }
    params.removeAllFilters();
    if (getByValue) {
      params.addFilter(
        'id',
        this.form.get('ccp_addressee' + (ccp == 1 ? '' : '_1')).value
      );
    } else {
      params.addFilter('name', paramsData['search'], SearchFilter.LIKE);
    }
    params['sortBy'] = 'name:ASC';
    let subscription = this.svLegalOpinionsOfficeService
      .getIssuingUserByDetail(params.getParams())
      .subscribe({
        next: data => {
          let tempDataUser = new DefaultSelect(
            data.data.map(i => {
              i.name = '#' + i.id + ' -- ' + i.name;
              return i;
            }),
            data.count
          );
          if (ccp == 1) {
            this.userCopies1 = tempDataUser;
          } else {
            this.userCopies2 = tempDataUser;
          }
          console.log(data, this.userCopies1);
          subscription.unsubscribe();
        },
        error: error => {
          if (ccp == 1) {
            this.userCopies1 = new DefaultSelect();
          } else {
            this.userCopies2 = new DefaultSelect();
          }
          subscription.unsubscribe();
        },
      });
  }

  changeTypeOffice(event: any) {
    // console.log(event);
    if (event) {
      console.log(event.target.value);
      if (event.target.value && this.dictationData) {
        this.officeDictationData =
          this.svLegalOpinionsOfficeService.getTextDefaultDictation(
            this.dictationData,
            this.expedientData,
            this.officeDictationData,
            event.target.value
          );
      }
    }
  }

  changeCopiesType(event: any, ccp: number) {
    console.log(event.target.value, ccp);
    if (ccp == 1) {
      console.log('CCP1');
      this.form.get('ccp_addressee').reset();
      this.form.get('ccp_TiPerson').reset();
      if (event.target.value == 'I') {
        this.form.get('ccp_addressee').enable();
        this.form.get('ccp_TiPerson').disable();
      } else if (event.target.value == 'E') {
        this.form.get('ccp_addressee').disable();
        this.form.get('ccp_TiPerson').enable();
      }
    } else {
      console.log('CCP2');
      this.form.get('ccp_addressee_1').reset();
      this.form.get('ccp_TiPerson_1').reset();
      if (event.target.value == 'I') {
        this.form.get('ccp_addressee_1').enable();
        this.form.get('ccp_TiPerson_1').disable();
      } else if (event.target.value == 'E') {
        this.form.get('ccp_addressee_1').disable();
        this.form.get('ccp_TiPerson_1').enable();
      }
    }
  }
}

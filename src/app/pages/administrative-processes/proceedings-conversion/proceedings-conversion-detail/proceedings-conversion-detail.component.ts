import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ICity } from 'src/app/core/models/catalogs/city.model';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { ConvertiongoodService } from 'src/app/core/services/ms-convertiongood/convertiongood.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { AbandonmentsDeclarationTradesService } from 'src/app/pages/juridical-processes/abandonments-declaration-trades/service/abandonments-declaration-trades.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ActasConvertionCommunicationService } from '../services/proceedings-conversionn';
@Component({
  selector: 'app-proceedings-conversion-detail',
  templateUrl: './proceedings-conversion-detail.component.html',
  styles: [],
})
export class ProceedingsConversionDetailComponent
  extends BasePage
  implements OnInit
{
  header: ModelForm<any>;
  antecedent: ModelForm<any>;
  antecedentTwo: ModelForm<any>;
  antecedentThree: ModelForm<any>;
  first: ModelForm<any>;
  closureOfMinutes: ModelForm<any>;
  antecedentThreeEnable: boolean = false;
  inputValue: string;
  userRes: any;
  inputDisabled: boolean = true;
  showEnableDetail = false;
  datosEnviadosSource: any;

  idConversion: any;
  valUpdate: boolean = true;
  cities = new DefaultSelect<ICity>();
  appointedBy = new DefaultSelect<ICity>();
  valForm: boolean;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private actasConvertionCommunicationService: ActasConvertionCommunicationService,
    private convertiongoodService: ConvertiongoodService,
    private abandonmentsService: AbandonmentsDeclarationTradesService,
    private securityService: SecurityService,
    private cityService: CityService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.actasConvertionCommunicationService
      .getInputValue()
      .subscribe(value => {
        this.inputValue = value;
        console.log('AQUII', this.inputValue);
        this.header.value.idConversion =
          this.actasConvertionCommunicationService.setInputValue;
        this.inputDisabled = false;
      });

    this.actasConvertionCommunicationService
      .getInputValue3()
      .subscribe(value => {
        if (value) {
          this.closureOfMinutes.enable();
          this.antecedentThree.enable();
          this.antecedentTwo.enable();
          this.antecedent.enable();
          this.header.enable();
          this.first.enable();
          this.valForm = true;
        } else {
          this.closureOfMinutes.disable();
          this.antecedentThree.disable();
          this.antecedentTwo.disable();
          this.antecedent.disable();
          this.header.disable();
          this.first.disable();
          this.valForm = false;
        }
      });

    this.actasConvertionCommunicationService
      .getInputValue2()
      .subscribe(value => {
        if (value) {
          this.idConversion = value;

          console.log('AQUII2222', value);
          this.header.get('idConversion').setValue(this.idConversion);

          this.convertiongoodService.getConvertionActaById(value).subscribe({
            next: async (res: any) => {
              const data = res;
              this.valUpdate = true;
              this.inputDisabled = false;

              // if (data.encabDesignatedx.toString()) {
              //   const paramsRecipient: any = new ListParams();
              //   paramsRecipient.text = data.encabDesignatedx.toString();
              //   this.getappointedBy(paramsRecipient);
              // }

              await this.llenarInputs(data);

              console.log(res);
            },
            error: error => {
              this.valUpdate = false;
              this.header.reset();
              this.closureOfMinutes.reset();
              this.first.reset();
              this.antecedentThree.reset();
              this.antecedentTwo.reset();
              this.antecedent.reset();
              this.header.get('idConversion').setValue(this.idConversion);
              console.log(error);
            },
          });
        }
      });
  }

  async llenarInputs(data: any) {
    this.header.patchValue({
      destiny: data.encabDestination,
      city: data.encabCity,
      status: data.encabState,
      hour: data.encabTimeRecord,
      date: await this.getDate(data.encabDateMinutes),
      appointedBy: data.encabDesignatedx,
      titleOf: data.encabdesignatedXArea,
      officeNumber: data.encabOfficeNumber,
      dateOfOffice: await this.getDate(data.encabOfficeDate),
    });

    this.antecedent.patchValue({
      tradeEntity: data.antec1OfficeEntity,
      officialDate: await this.getDate(data.antec1OfficeDate),
      signedBy: data.antec1SubscribedX,
      position: data.antec1Charge,
      dependence: data.antec1Dependence,
      customs: data.antec1Aduana,
      container: data.antec1Customs,
      noContainer: data.antec1ContainerNumber,
    });

    this.antecedentTwo.patchValue({
      job: data.antec2OOffice,
      officialDate: await this.getDate(data.antec2OfDate),
      signedBy: data.antec2OfSubscribedX,
      position: data.actec2OfSubscribedxCharge,
      propertyOf: data.antec2OwnedBy,
    });

    this.antecedentThree.patchValue({
      date: await this.getDate(data.antec3PropertyDate),
      subscribe1: data.antec3Subscribes1,
      position1: data.antec3Charge1,
      attachedA: data.antec3Adscritoa1,
      subscribe2: data.antec3Subscribes2,
      position2: data.antec3Charge2,
      attachedB: data.antec3Adscritoa2,
      wineriesSAE: data.antec3WinerySae,
      verificationOf: data.antec3Verification,
      consistsIn: data.antec3Weight,
      correspondentA: data.antec3Amount,
      description: data.antec3Description,
      status: data.antec3State,
    });

    this.first.patchValue({
      authorizedBy: data.primeraAutorizadoX,
      addressee: data.firstAddressee,
    });

    this.closureOfMinutes.patchValue({
      date: await this.getDate(data.closingDate),
      hour: data.closingSheet,
      closePages: data.closingFojas,
    });
  }
  async getDate(date: any) {
    console.log('date', date);
    // const formattedDate = moment(date).format('DD-MM-YYYY');
    if (date) {
      const fechaEscritura: any = new Date(date);
      fechaEscritura.setUTCDate(fechaEscritura.getUTCDate());
      const _fechaEscritura: any = new Date(fechaEscritura.toISOString());
      return date ? _fechaEscritura : null;
    } else {
      return null;
    }
    // { authorizeDate: formattedDate }
    // { emitEvent: false }
  }
  private prepareForm() {
    this.header = this.fb.group({
      destiny: [null, Validators.required],
      idConversion: [null, Validators.required],
      city: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      status: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      hour: [null, Validators.required],
      date: [null, Validators.required],
      appointedBy: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      titleOf: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      officeNumber: [null, Validators.required],
      dateOfOffice: [null, Validators.required],
    });
    this.antecedent = this.fb.group({
      tradeEntity: [null, [Validators.pattern(STRING_PATTERN)]],
      officialDate: [null],
      signedBy: [null, [Validators.pattern(STRING_PATTERN)]],
      position: [null, [Validators.pattern(STRING_PATTERN)]],
      dependence: [null, [Validators.pattern(STRING_PATTERN)]],
      customs: [null, [Validators.pattern(STRING_PATTERN)]],
      container: [null, [Validators.pattern(STRING_PATTERN)]],
      noContainer: [null],
    });
    this.antecedentTwo = this.fb.group({
      job: [null, [Validators.pattern(STRING_PATTERN)]],
      officialDate: [null],
      signedBy: [null, [Validators.pattern(STRING_PATTERN)]],
      position: [null, [Validators.pattern(STRING_PATTERN)]],
      propertyOf: [null, [Validators.pattern(STRING_PATTERN)]],
    });
    this.antecedentThree = this.fb.group({
      date: [null],
      subscribe1: [null, [Validators.pattern(STRING_PATTERN)]],
      position1: [null, [Validators.pattern(STRING_PATTERN)]],
      attachedA: [null, [Validators.pattern(STRING_PATTERN)]],
      subscribe2: [null, [Validators.pattern(STRING_PATTERN)]],
      position2: [null, [Validators.pattern(STRING_PATTERN)]],
      attachedB: [null, [Validators.pattern(STRING_PATTERN)]],
      wineriesSAE: [null, [Validators.pattern(STRING_PATTERN)]],
      verificationOf: [null, [Validators.pattern(STRING_PATTERN)]],
      consistsIn: [null, [Validators.pattern(STRING_PATTERN)]],
      correspondentA: [null, [Validators.pattern(STRING_PATTERN)]],
      description: [null, [Validators.pattern(STRING_PATTERN)]],
      status: [null, [Validators.pattern(STRING_PATTERN)]],
    });
    this.first = this.fb.group({
      authorizedBy: [null, [Validators.pattern(STRING_PATTERN)]],
      addressee: [null, [Validators.pattern(STRING_PATTERN)]],
    });
    this.closureOfMinutes = this.fb.group({
      date: [null],
      hour: [null],
      closePages: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  public next() {
    this.antecedentThreeEnable = true;
  }
  public previous() {
    this.antecedentThreeEnable = false;
  }
  close() {
    this.modalRef.hide();
  }

  salvar() {
    if (this.header.invalid) return this.header.markAllAsTouched();

    // if (this.antecedentTwo.invalid)
    //   return this.antecedentTwo.markAllAsTouched()

    // if (this.antecedentThree.invalid)
    //   return this.antecedentThree.markAllAsTouched()

    // if (this.first.invalid)
    //   return this.first.markAllAsTouched()

    // if (this.closureOfMinutes.invalid)
    //   return this.closureOfMinutes.markAllAsTouched()

    if (this.valUpdate) {
      // UPDATE
      console.log('form', this.header);
      let obj: any = {
        id: Number(this.idConversion),
        encabDestination: this.header.value.destiny,
        encabCity: this.header.value.city,
        encabState: this.header.value.status,
        encabTimeRecord: this.header.value.hour,
        encabDateMinutes: this.header.value.date,
        encabDesignatedx: this.header.value.appointedBy,
        encabdesignatedXArea: this.header.value.titleOf,
        encabOfficeNumber: this.header.value.officeNumber,
        encabOfficeDate: this.header.value.dateOfOffice,

        antec1OfficeEntity: this.antecedent.value.tradeEntity,
        antec1OfficeDate: this.antecedent.value.officialDate,
        antec1SubscribedX: this.antecedent.value.signedBy,
        antec1Charge: this.antecedent.value.position,
        antec1Dependence: this.antecedent.value.dependence,
        antec1Aduana: this.antecedent.value.customs,
        antec1Customs: this.antecedent.value.container,
        antec1ContainerNumber: this.antecedent.value.noContainer,

        antec2OOffice: this.antecedentTwo.value.job,
        antec2OfDate: this.antecedentTwo.value.officialDate,
        antec2OfSubscribedX: this.antecedentTwo.value.signedBy,
        actec2OfSubscribedxCharge: this.antecedentTwo.value.position,
        antec2OwnedBy: this.antecedentTwo.value.propertyOf,

        antec3PropertyDate: this.antecedentThree.value.date,
        antec3Subscribes1: this.antecedentThree.value.subscribe1,
        antec3Charge1: this.antecedentThree.value.position1,
        antec3Adscritoa1: this.antecedentThree.value.attachedA,
        antec3Subscribes2: this.antecedentThree.value.subscribe2,
        antec3Charge2: this.antecedentThree.value.position2,
        antec3Adscritoa2: this.antecedentThree.value.attachedB,
        antec3WinerySae: this.antecedentThree.value.wineriesSAE,
        antec3Verification: this.antecedentThree.value.verificationOf,
        antec3Weight: this.antecedentThree.value.consistsIn,
        antec3Amount: this.antecedentThree.value.correspondentA,
        antec3Description: this.antecedentThree.value.description,
        antec3State: this.antecedentThree.value.status,

        primeraAutorizadoX: this.first.value.authorizedBy,
        firstAddressee: this.first.value.addressee,

        closingSheet: this.closureOfMinutes.value.hour,
        closingDate: this.closureOfMinutes.value.date,
        closingFojas: this.closureOfMinutes.value.closePages,
      };

      this.convertiongoodService
        .updateConvertionActa(obj, Number(this.idConversion))
        .subscribe({
          next: (res: any) => {
            this.valUpdate = true;
            this.alert(
              'success',
              'El Detalle de Acta se Actualizó Correctamente',
              ''
            );
            console.log(res);
          },
          error: error => {
            this.valUpdate = false;
            this.alert('error', 'Error al Intentar Guardar los Cambios', '');
            console.log(error);
          },
        });
    } else {
      // CREATE
      console.log('form', this.header);

      let obj: any = {
        id: Number(this.idConversion),
        encabDestination: this.header.value.destiny,
        encabCity: this.header.value.city,
        encabState: this.header.value.status,
        encabTimeRecord: this.header.value.hour,
        encabDateMinutes: this.header.value.date,
        encabDesignatedx: this.header.value.appointedBy,
        encabdesignatedXArea: this.header.value.titleOf,
        encabOfficeNumber: this.header.value.officeNumber,
        encabOfficeDate: this.header.value.dateOfOffice,

        antec1OfficeEntity: this.antecedent.value.tradeEntity,
        antec1OfficeDate: this.antecedent.value.officialDate,
        antec1SubscribedX: this.antecedent.value.signedBy,
        antec1Charge: this.antecedent.value.position,
        antec1Dependence: this.antecedent.value.dependence,
        antec1Aduana: this.antecedent.value.customs,
        antec1Customs: this.antecedent.value.container,
        antec1ContainerNumber: this.antecedent.value.noContainer,

        antec2OOffice: this.antecedentTwo.value.job,
        antec2OfDate: this.antecedentTwo.value.officialDate,
        antec2OfSubscribedX: this.antecedentTwo.value.signedBy,
        actec2OfSubscribedxCharge: this.antecedentTwo.value.position,
        antec2OwnedBy: this.antecedentTwo.value.propertyOf,

        antec3PropertyDate: this.antecedentThree.value.date,
        antec3Subscribes1: this.antecedentThree.value.subscribe1,
        antec3Charge1: this.antecedentThree.value.position1,
        antec3Adscritoa1: this.antecedentThree.value.attachedA,
        antec3Subscribes2: this.antecedentThree.value.subscribe2,
        antec3Charge2: this.antecedentThree.value.position2,
        antec3Adscritoa2: this.antecedentThree.value.attachedB,
        antec3WinerySae: this.antecedentThree.value.wineriesSAE,
        antec3Verification: this.antecedentThree.value.verificationOf,
        antec3Weight: this.antecedentThree.value.consistsIn,
        antec3Amount: this.antecedentThree.value.correspondentA,
        antec3Description: this.antecedentThree.value.description,
        antec3State: this.antecedentThree.value.status,

        primeraAutorizadoX: this.first.value.authorizedBy,
        firstAddressee: this.first.value.addressee,

        closingSheet: this.closureOfMinutes.value.hour,
        closingDate: this.closureOfMinutes.value.date,
        closingFojas: this.closureOfMinutes.value.closePages,
      };

      this.convertiongoodService.creatConvertionActa(obj).subscribe({
        next: (res: any) => {
          this.valUpdate = true;
          this.alert('success', 'El Detalle de Acta se Creó Correctamente', '');
          console.log(res);
        },
        error: error => {
          this.alert('error', 'Error al Intentar Guardar los Cambios', '');
          console.log(error);
        },
      });
    }
  }

  getCities(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams?.text.length > 0)
      if (!isNaN(parseInt(lparams?.text))) {
        console.log('SI');
        params.addFilter('idCity', lparams.text, SearchFilter.EQ);
      } else {
        console.log('NO');
        params.addFilter('nameCity', lparams.text, SearchFilter.ILIKE);
      }

    // this.hideError();
    this.cityService.getAllFiltered(params.getParams()).subscribe({
      next: data => {
        let result = data.data.map((c: any) => {
          c['nameAndId'] = `${c.nameCity}`;
        });

        Promise.all(result).then(item => {
          this.cities = new DefaultSelect(data.data, data.count);
        });
        // console.log('CITY', data);
      },
      error: () => {
        this.cities = new DefaultSelect();
      },
    });
  }

  async getSenders(params: ListParams) {
    this.securityService.getAllUsersTracker(params).subscribe(
      (data: any) => {
        let result = data.data.map(async (item: any) => {
          item['userAndName'] = item.user + ' - ' + item.name;
        });
        Promise.all(result).then((resp: any) => {
          this.appointedBy = new DefaultSelect(data.data, data.count);
          this.loading = false;
        });
      },
      error => {
        this.appointedBy = new DefaultSelect();
      }
    );
  }

  getappointedBy(params: ListParams) {
    params['filter.user'] = `$eq:${params.text}`;
    this.securityService.getAllUsersTracker(params).subscribe(
      (data: any) => {
        let result = data.data.map(async (item: any) => {
          item['userAndName'] = item.user + ' - ' + item.name;
        });

        Promise.all(result).then((resp: any) => {
          this.header.get('appointedBy').setValue(data.data[0]);

          // this.recipients = new DefaultSelect(data.data, data.count);
          this.loading = false;
        });
      },
      error => {
        this.appointedBy = new DefaultSelect();
      }
    );
  }
}

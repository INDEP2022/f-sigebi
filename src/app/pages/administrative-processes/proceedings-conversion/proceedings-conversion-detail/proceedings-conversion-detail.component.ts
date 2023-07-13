import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ActasConvertionCommunicationService } from '../services/proceedings-conversionn';
@Component({
  selector: 'app-proceedings-conversion-detail',
  templateUrl: './proceedings-conversion-detail.component.html',
  styles: [],
})
export class ProceedingsConversionDetailComponent implements OnInit {
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
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private actasConvertionCommunicationService: ActasConvertionCommunicationService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
    this.actasConvertionCommunicationService
      .getInputValue()
      .subscribe(value => {
        this.inputValue = value;
        console.log(this.inputValue);
        this.header.value.idConversion =
          this.actasConvertionCommunicationService.setInputValue;
        this.inputDisabled = false;
      });
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
      tradeEntity: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      officialDate: [null, Validators.required],
      signedBy: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      position: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      dependence: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      customs: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      container: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      noContainer: [null, Validators.required],
    });
    this.antecedentTwo = this.fb.group({
      job: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      officialDate: [null, Validators.required],
      signedBy: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      position: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      propertyOf: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    this.antecedentThree = this.fb.group({
      date: [null, Validators.required],
      subscribe1: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      position1: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      attachedA: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      subscribe2: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      position2: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      attachedB: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      wineriesSAE: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      verificationOf: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      consistsIn: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      correspondentA: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      status: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
    this.first = this.fb.group({
      authorizedBy: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      addressee: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    this.closureOfMinutes = this.fb.group({
      date: [null, Validators.required],
      hour: [null, Validators.required],
      closePages: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
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
<<<<<<< HEAD
=======

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
            this.alert('success', 'El acta se actualizó correctamente', '');
            console.log(res);
          },
          error: error => {
            this.valUpdate = false;
            this.alert('error', 'Error al intentar guardar los cambios', '');
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
          this.alert('success', 'El acta se creó correctamente', '');
          console.log(res);
        },
        error: error => {
          this.alert('error', 'Error al intentar guardar los cambios', '');
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
>>>>>>> 53f8457b23297af4c094d5e9ce9d3f84d08a27fb
}

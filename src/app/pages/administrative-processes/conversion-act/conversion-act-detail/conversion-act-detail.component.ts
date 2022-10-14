import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conversion-act-detail',
  templateUrl: './conversion-act-detail.component.html',
  styles: [],
})
export class ConversionActDetailComponent implements OnInit {
  //Reactive Forms

  form: FormGroup;

  //Geters del Encabezado
  get destination() {
    return this.form.get('destination');
  }
  get idConversion() {
    return this.form.get('idConversion');
  }
  get city() {
    return this.form.get('city');
  }
  get state() {
    return this.form.get('state');
  }
  get time() {
    return this.form.get('time');
  }
  get date() {
    return this.form.get('date');
  }
  get designated() {
    return this.form.get('designated');
  }
  get holder() {
    return this.form.get('holder');
  }
  get officeNumber() {
    return this.form.get('officeNumber');
  }
  get dateOffice() {
    return this.form.get('dateOffice');
  }

  //Geters del Antecedentes I
  get officeEntity() {
    return this.form.get('officeEntity');
  }
  get dateOfficeAntecedentsI() {
    return this.form.get('dateOfficeAntecedentsI');
  }
  get subscribed() {
    return this.form.get('subscribed');
  }
  get charge() {
    return this.form.get('charge');
  }
  get dependence() {
    return this.form.get('dependence');
  }
  get customsOffice() {
    return this.form.get('customsOffice');
  }
  get container() {
    return this.form.get('container');
  }
  get containerNumber() {
    return this.form.get('containerNumber');
  }

  //Geters del Antecedentes II
  get office() {
    return this.form.get('office');
  }
  get dateOfficeAntecedentsII() {
    return this.form.get('dateOfficeAntecedentsII');
  }
  get subscribedII() {
    return this.form.get('subscribedII');
  }
  get chargeII() {
    return this.form.get('chargeII');
  }
  get property() {
    return this.form.get('property');
  }

  //Geters del Antecedentes III
  get dateIII() {
    return this.form.get('dateIII');
  }
  get subscribed_1_III() {
    return this.form.get('subscribed_1_III');
  }
  get charge_1_III() {
    return this.form.get('charge_1_III');
  }
  get assign_1() {
    return this.form.get('assign_1');
  }
  get subscribed_2_III() {
    return this.form.get('subscribed_2_III');
  }
  get charge_2_III() {
    return this.form.get('charge_2_III');
  }
  get assign_2() {
    return this.form.get('assign_2');
  }
  get winerySAE() {
    return this.form.get('winerySAE');
  }
  get verificationOf() {
    return this.form.get('verificationOf');
  }
  get consistsOf() {
    return this.form.get('consistsOf');
  }
  get correspondingTo() {
    return this.form.get('correspondingTo');
  }
  get descriptionIII() {
    return this.form.get('descriptionIII');
  }
  get antStatus() {
    return this.form.get('antStatus');
  }

  //Geters de Primera
  get authorizedBy() {
    return this.form.get('authorizedBy');
  }
  get addressee() {
    return this.form.get('addressee');
  }

  //Geters de Cierre de Acta
  get dateClosingAct() {
    return this.form.get('dateClosingAct');
  }
  get timeClosingAct() {
    return this.form.get('timeClosingAct');
  }
  get closingFoja() {
    return this.form.get('closingFoja');
  }

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.buildFormHeader();
  }

  /**
   * @method: metodo para iniciar el formulario de Encabezado
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildFormHeader() {
    this.form = this.fb.group({
      destination: [null, [Validators.required]],
      idConversion: [null, [Validators.required]],
      city: [null, [Validators.required]],
      time: [null, [Validators.required]],
      state: [null, [Validators.required]],
      date: [null, [Validators.required]],
      designated: [null, [Validators.required]],
      holder: [null, [Validators.required]],
      officeNumber: [null, [Validators.required]],
      dateOffice: [null, [Validators.required]],
      officeEntity: [null, [Validators.required]],
      dateOfficeAntecedentsI: [null, [Validators.required]],
      subscribed: [null, [Validators.required]],
      charge: [null, [Validators.required]],
      dependence: [null, [Validators.required]],
      customsOffice: [null, [Validators.required]],
      container: [null, [Validators.required]],
      containerNumber: [null, [Validators.required]],
      office: [null, [Validators.required]],
      dateOfficeAntecedentsII: [null, [Validators.required]],
      subscribedII: [null, [Validators.required]],
      chargeII: [null, [Validators.required]],
      property: [null, [Validators.required]],
      subscribed_1_III: [null, [Validators.required]],
      dateIII: [null, [Validators.required]],
      charge_1_III: [null, [Validators.required]],
      assign_1: [null, [Validators.required]],
      subscribed_2_III: [null, [Validators.required]],
      charge_2_III: [null, [Validators.required]],
      assign_2: [null, [Validators.required]],
      winerySAE: [null, [Validators.required]],
      consistsOf: [null, [Validators.required]],
      verificationOf: [null, [Validators.required]],
      correspondingTo: [null, [Validators.required]],
      descriptionIII: [null, [Validators.required]],
      antStatus: [null, [Validators.required]],
      authorizedBy: [null, [Validators.required]],
      addressee: [null, [Validators.required]],
      dateClosingAct: [null, [Validators.required]],
      timeClosingAct: [null, [Validators.required]],
      closingFoja: [null, [Validators.required]],
    });
  }

  back() {
    this.router.navigate(['pages/administrative-processes/conversion-act']);
  }

  save() {
    console.log(this.form.value);
    //this.showToast('success');
    this.back();
  }

  setInputs() {
    this.idConversion.setValue('1');
  }

  /* showToast(status: NbComponentStatus) {
    this.toastrService.show(status, 'Guardado exitoso !!', { status });
  } */
}

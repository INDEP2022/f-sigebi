import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-opinion',
  templateUrl: './jp-d-tc-c-opinion.component.html',
  styles: [],
})
export class JpDTcCOpinionComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      numberGood: [null, [Validators.required]],
      numberGestion: [null, [Validators.required]],
      flywheel: [null, [Validators.required]],
      dictamination: [null, [Validators.required]],
      charge: [null, [Validators.required]],
      addressee: [null, [Validators.required]],
      addressee_I: [null, [Validators.required]],
      paragraphInitial: [null, [Validators.required]],
      paragraphFinish: [null, [Validators.required]],
      paragraphOptional: [null, [Validators.required]],
      descriptionSender: [null, [Validators.required]],
      typePerson: [null, [Validators.required]],
      senderUser: [null, [Validators.required]],
      typePerson_I: [null, [Validators.required]],
      senderUser_I: [null, [Validators.required]],
      key: [null, [Validators.required]],
      numberDictamination: [null, [Validators.required]],
    });
  }

  confirm() {
    this.loading = true;
    //console.log(this.checkedListFA,this.checkedListFI)
    console.log(this.form.value);
    setTimeout(st => {
      this.loading = false;
    }, 5000);
  }
}

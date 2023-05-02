import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModelForm } from '../../../../core/interfaces/model-form';
import { BasePage } from '../../../../core/shared/base-page';
import { PrintDictateComponent } from '../print-dictate/print-dictate.component';

@Component({
  selector: 'app-generate-autorization',
  templateUrl: './generate-autorization.component.html',
  styles: [],
})
export class GenerateAutorizationComponent extends BasePage implements OnInit {
  information: any | null = null;
  informationClose: any | null = null;
  typeReport: string = '';
  childModal: BsModalRef;
  generateProgrammingForm: ModelForm<any>;
  btnTitle: string = 'Guardar';
  isInvalid: boolean = true;

  constructor(
    private bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    console.log(this.informationClose);
    this.generateProgrammingForm
      .get('typeAuthProgramming')
      .valueChanges.subscribe(data => {
        setTimeout(() => {
          this.handleChangeProgramming(data);
        }, 0);
      });
  }

  initForm(): void {
    this.generateProgrammingForm = this.fb.group({
      typeAuthProgramming: [null, [Validators.required]],
      refuseProgramming: [null],
      acceptProgramming: [null],
    });
  }

  close(): void {
    this.bsModalRef.hide();
  }

  confirm() {
    console.log(this.generateProgrammingForm.value);
    let form = this.generateProgrammingForm.value;
    //console.log(this.generateProgrammingForm.get('acceptProgramming').value)
    if (
      this.generateProgrammingForm.get('typeAuthProgramming').value ===
      'programacion autorizada'
    ) {
      this.openModal(PrintDictateComponent, form, 'dictate-assets');
      this.close();
    } else {
      //todo -> concluir la autorizacion de la programacion cambiando el estado
    }
  }

  handleChangeProgramming(type: any) {
    if (type === 'programacion rechazada') {
      this.generateProgrammingForm.get('acceptProgramming').patchValue(null);
      this.isInvalid = true;
      this.generateProgrammingForm
        .get('refuseProgramming')
        .valueChanges.subscribe(data => {
          if (data !== '') this.isInvalid = false;
        });
      this.btnTitle = 'Guardar';
    } else if (type === 'programacion autorizada') {
      this.generateProgrammingForm.get('refuseProgramming').patchValue(null);
      this.isInvalid = true;
      this.generateProgrammingForm
        .get('acceptProgramming')
        .valueChanges.subscribe(data => {
          if (data !== '') this.isInvalid = false;
        });
      this.btnTitle = 'Generar Reporte';
    }
  }

  openModal(component: any, information?: any, typeReport?: string) {
    let config: ModalOptions = {
      initialState: {
        information: information,
        typeReport: typeReport,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.childModal = this.modalService.show(component, config);
  }
}

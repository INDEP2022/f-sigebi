import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { AppState } from '../../../../../app.reducers';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { BasePage } from '../../../../../core/shared/base-page';
import { AnnexJFormComponent } from '../annex-j-form/annex-j-form.component';
import { AnnexKFormComponent } from '../annex-k-form/annex-k-form.component';
import { selectListItems } from '../store/item.selectors';

@Component({
  selector: 'app-verify-noncompliance',
  templateUrl: './verify-noncompliance.component.html',
  styleUrls: ['./verify-noncompliance.component.scss'],
})
export class VerifyNoncomplianceComponent extends BasePage implements OnInit {
  title: string = 'Verificación Incumplimiento 539';
  showSamplingDetail: boolean = true;
  showFilterAssets: boolean = true;
  filterForm: ModelForm<any>;

  isEnableAnex: boolean = false;
  willSave: boolean = false;
  //envia los datos para mostrarse en el detalle de anexo
  annexDetail: any[] = [];

  clasificationAnnex: boolean = true;

  listItems$: Observable<any> = new Observable();

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private bsModalRef: BsModalRef,
    private store: Store<AppState>
  ) {
    super();
  }

  ngOnInit(): void {
    this.initFilterForm();
  }

  initFilterForm() {
    this.filterForm = this.fb.group({
      noManagement: [null],
      noInventory: [null],
      descriptionAsset: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  openAnnexJ(): void {
    this.openModal(AnnexJFormComponent, '', 'annexJ-verify-noncompliance');
  }

  opemAnnexK(): void {
    this.openModal(AnnexKFormComponent, '', 'annexK-verify-noncompliance');
  }

  save() {
    this.willSave = true;

    this.listItems$ = this.store.select(selectListItems);

    this.listItems$.subscribe(data => {
      console.log(data);
    });
  }

  turnSampling() {
    this.isEnableAnex = true;

    this.alertQuestion(
      undefined,
      'Confirmación',
      '¿Está seguro que la informacion es correcta para turnar?',
      'Aceptar'
    ).then(question => {
      if (question.isConfirmed) {
        console.log('enviar mensaje');
      }
    });
  }

  openModal(component: any, data?: any, typeAnnex?: string): void {
    let config: ModalOptions = {
      initialState: {
        data: data,
        typeAnnex: typeAnnex,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(component, config);

    //this.bsModalRef.content.event.subscribe((res: any) => {
    //cargarlos en el formulario
    //console.log(res);
    //this.assetsForm.controls['address'].get('longitud').enable();
    //this.requestForm.get('receiUser').patchValue(res.user);
    //});
  }
}

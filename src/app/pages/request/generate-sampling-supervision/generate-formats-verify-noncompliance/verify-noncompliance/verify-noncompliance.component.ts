import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { AnnexJFormComponent } from '../annex-j-form/annex-j-form.component';
import { AnnexKFormComponent } from '../annex-k-form/annex-k-form.component';

@Component({
  selector: 'app-verify-noncompliance',
  templateUrl: './verify-noncompliance.component.html',
  styleUrls: ['./verify-noncompliance.component.scss'],
})
export class VerifyNoncomplianceComponent implements OnInit {
  title: string = 'Verificación Incumplimiento 539';
  showSamplingDetail: boolean = true;
  showFilterAssets: boolean = true;
  filterForm: ModelForm<any>;

  isEnableAnex: boolean = false;
  willSave: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private bsModalRef: BsModalRef
  ) {}

  ngOnInit(): void {
    this.initFilterForm();
  }

  initFilterForm() {
    this.filterForm = this.fb.group({
      noManagement: [null],
      noInventory: [null],
      descriptionAsset: [null],
    });
  }

  openAnnexJ(): void {
    this.openModal(AnnexJFormComponent, '');
  }

  opemAnnexK(): void {
    this.openModal(AnnexKFormComponent, '');
  }

  save() {
    this.willSave = true;
  }

  turnSampling() {
    this.isEnableAnex = true;
  }

  openModal(component: any, data?: any): void {
    let config: ModalOptions = {
      initialState: {
        data: data,
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

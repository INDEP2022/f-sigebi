import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { PHOTOGRAPHY_COLUMNS } from './photography-columns';

@Component({
  selector: 'app-photography-form',
  templateUrl: './photography-form.component.html',
  styleUrls: ['./photography.scss'],
})
export class PhotographyFormComponent extends BasePage implements OnInit {
  photographs: any[] = [];
  showForm: boolean = false;
  photographyForm: FormGroup = new FormGroup({});

  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    super();
    this.settings = {
      ...this.settings,
      columns: PHOTOGRAPHY_COLUMNS,
      edit: { editButtonContent: '<i class="bx bxs-image"></i> Ver' },
    };

    this.photographs = [
      {
        noPhotography: 345343,
        managementNumber: 'Solicitud-565646',
        typeDocument: 'prueba',
        titleDocument: 'Documento',
        author: 'Usuario prueba',
        createDate: '12-11-2022',
        noProgrammation: '56456456',
        programmingFolio: '677567566',
      },
    ];
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.photographyForm = this.fb.group({
      managementNumber: [5296016],
      noProgrammation: [null],
      noImage: [null],
      author: [null],
      titleImage: [null],
      noPhotography: [null],
      text: [null],
      programmingFolio: [null],
    });
  }

  viewImage() {}

  uploadPhotography() {}

  confirm() {}

  close() {
    this.modalRef.hide();
  }
}

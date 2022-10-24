import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-documents-list',
  standalone: true,
  imports: [CommonModule, SharedModule, TooltipModule],
  templateUrl: './documents-list.component.html',
  styleUrls: ['./documents-list.component.scss'],
})
export class DocumentsListComponent extends BasePage implements OnInit {
  @ViewChildren('documentContents') documentContents: QueryList<
    ElementRef<HTMLDivElement>
  >;
  isSingleClick: boolean = false;
  documentSelected: any;
  files = FILES_EXAMPLE;
  params = new BehaviorSubject(new ListParams());
  totalItems: 0;

  constructor() {
    super();
  }

  onDocumentContentClick(documentContent: HTMLDivElement, file: any) {
    this.isSingleClick = true;
    setTimeout(() => {
      if (this.isSingleClick) {
        this.styleDocumentContent(documentContent, file);
      }
    }, 250);
  }

  viewDocument() {
    this.isSingleClick = false;
  }

  styleDocumentContent(documentContent: HTMLDivElement, file: any) {
    this.documentSelected = file;
    this.documentContents.forEach(content => {
      content.nativeElement.classList.remove('active');
    });
    documentContent.classList.add('active');
  }

  ngOnInit(): void {}
}

const FILES_EXAMPLE = [
  {
    id: 123456,
    pages: 12,
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit`,
  },
  {
    id: 123456,
    pages: 12,
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit`,
  },

  {
    id: 123456,
    pages: 12,
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit`,
  },

  {
    id: 123456,
    pages: 12,
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit`,
  },

  {
    id: 123456,
    pages: 12,
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit`,
  },

  {
    id: 123456,
    pages: 12,
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit`,
  },
  {
    id: 123456,
    pages: 12,
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit`,
  },
  {
    id: 123456,
    pages: 12,
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit`,
  },
];

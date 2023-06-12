import { Injectable } from '@angular/core';
import { BasePage } from 'src/app/core/shared';

@Injectable()
export class RelatedDocumentDesahogo extends BasePage {
  constructor() {
    super();
  }

  mimetodo(): boolean {
    return false;
  }
}

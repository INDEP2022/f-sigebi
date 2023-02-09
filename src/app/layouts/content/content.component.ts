import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScriptService } from 'src/app/common/services/script.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styles: [],
})
export class ContentComponent implements OnInit {
  constructor(
    private scriptService: ScriptService,
    @Inject(DOCUMENT) private document: Document,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/pages/general-processes/goods-tracker']);
    }
    this.scriptService.removeScript('my-script');
    const header: HTMLCollectionOf<HTMLElement> =
      this.document.getElementsByTagName('header');
    header[0]?.remove();
    const footer: HTMLCollectionOf<HTMLElement> =
      this.document.getElementsByTagName('footer');
    footer[0]?.remove();
  }
}

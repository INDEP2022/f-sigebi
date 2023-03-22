import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styles: [
    `
      .siab-color {
        color: #9d2449;
      }

      .tag {
        padding: 0.5rem;
        font-size: 12px;
        background-color: rgb(157 36 73 / 50%);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
      }

      .flex {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class BreadcrumbComponent
  extends BasePage
  implements OnInit, AfterViewInit
{
  show: boolean = false;
  paths: string[] = [];
  constructor(private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.router.events.subscribe(route => {
      if (route instanceof NavigationEnd) {
        this.createBreadCrumb();
      }
    });
  }

  ngAfterViewInit(): void {
    this.createBreadCrumb();
  }

  createBreadCrumb() {
    const time = setTimeout(() => {
      this.paths = [];
      const parent = document.querySelector('li.mm-active');
      if (parent) {
        this.show = true;
        this.paths.push(parent.children[0].textContent);
        const childs = document.querySelectorAll(
          'app-menu-dynamic ul li.mm-active'
        );
        if (childs) {
          for (let index = 0; index < childs.length; index++) {
            const element = childs[index].children[0].textContent;
            this.paths.push(element);
          }
        }
      }
      clearTimeout(time);
    }, 0);
  }
}

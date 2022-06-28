import { DOCUMENT, } from '@angular/common';
import { Component, OnInit, Inject, HostListener } from '@angular/core';

@Component({
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.css'],
})
export class ScrollToTopComponent implements OnInit {
  private windowScrolled!: boolean;

  constructor(@Inject(DOCUMENT) private document: Document) { }
  @HostListener("window:scroll", [])
  private onWindowScroll(){
    if(window.pageYOffset || document.documentElement.scrollTop || this.document.body.scrollTop > 100) {
      this.windowScrolled = true;
    }else if
      (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || this.document.body.scrollTop < 10) {
      this.windowScrolled = false;
    }
  }
  private scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  ngOnInit(): void {
  }

}

import { Component, ElementRef, Renderer2 } from '@angular/core';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {
  constructor(private renderer: Renderer2) {}
  scrollToParagraph(paragraphId: string): void {
    const element = document.getElementById(paragraphId);
    if (element) {
        this.renderer.setProperty(window, 'scrollBehavior', 'smooth');
        element.scrollIntoView();
        this.renderer.setProperty(window, 'scrollBehavior', 'auto');
    }
}
}

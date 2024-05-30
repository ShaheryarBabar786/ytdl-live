import { Component, OnInit } from "@angular/core";

import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-Privicy",
  templateUrl: "./privicy.component.html",
  styleUrls: ["./privicy.component.scss"],
})
export class PrivicyComponent implements OnInit {
  data: Date = new Date();

  selectedLanguage: string = "en";

  constructor(private translateService: TranslateService) {
    this.selectedLanguage = "en";
  }

  ngOnInit() {
    var navbar = document.getElementsByTagName("nav")[0];
    navbar.classList.add("navbar-transparent");
  }
  ngOnDestroy() {
    var navbar = document.getElementsByTagName("nav")[0];
    navbar.classList.remove("navbar-transparent");
  }

  changeLanguage() {
    this.translateService.use(this.selectedLanguage);
  }

  scrollToSection(sectionName: string) {
    const sectionElement = document.querySelector(`#${sectionName}`);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth" });
    }
  }
}

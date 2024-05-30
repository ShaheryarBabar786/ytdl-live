import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-Disclaimer",
  templateUrl: "./Disclaimer.component.html",
  styleUrls: ["./Disclaimer.component.scss"],
})
export class DisclaimerComponent implements OnInit {
  data: Date = new Date();

  selectedLanguage: string = "en";

  constructor(private translateService: TranslateService) {
    this.selectedLanguage = "en";
  }

  ngOnInit() {}
  ngOnDestroy() {}

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

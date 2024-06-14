import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-Pagenotfound",
  templateUrl: "./pagenotfound.component.html",
  styleUrls: ["./pagenotfound.component.scss"],
})
export class PagenotfoundComponent implements OnInit, OnDestroy, AfterViewInit {
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

  ngAfterViewInit() {
    this.initRandomNumberAnimation();
  }

  initRandomNumberAnimation() {
    function randomNum() {
      "use strict";
      return Math.floor(Math.random() * 9) + 1;
    }

    let loop1: any,
      loop2: any,
      loop3: any,
      time = 30,
      i = 0;
    const selector3 = document.querySelector(".thirdDigit") as HTMLElement;
    const selector2 = document.querySelector(".secondDigit") as HTMLElement;
    const selector1 = document.querySelector(".firstDigit") as HTMLElement;

    loop3 = setInterval(() => {
      "use strict";
      if (i > 40) {
        clearInterval(loop3);
        selector3.textContent = "4";
      } else {
        selector3.textContent = randomNum().toString();
        i++;
      }
    }, time);

    loop2 = setInterval(() => {
      "use strict";
      if (i > 80) {
        clearInterval(loop2);
        selector2.textContent = "0";
      } else {
        selector2.textContent = randomNum().toString();
        i++;
      }
    }, time);

    loop1 = setInterval(() => {
      "use strict";
      if (i > 100) {
        clearInterval(loop1);
        selector1.textContent = "4";
      } else {
        selector1.textContent = randomNum().toString();
        i++;
      }
    }, time);
  }
}

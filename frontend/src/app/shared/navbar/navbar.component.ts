import { Component, OnInit, ElementRef, HostListener } from "@angular/core";
import { Location } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { NavigationEnd, Router } from "@angular/router";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  private toggleButton: any;
  private sidebarVisible: boolean;
  selectedLanguage: string;

  showNavbar: boolean = true;

  constructor(
    public location: Location,
    private element: ElementRef,
    private translateService: TranslateService,
    private router: Router // Add this line
  ) {
    this.sidebarVisible = false;
  }

  ngOnInit() {
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggler")[0];
    this.selectedLanguage =
      localStorage.getItem("selectedLanguage") || "English";
    this.translateService.setDefaultLang(this.selectedLanguage);
  }
  scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    const navbarContainer =
      this.element.nativeElement.querySelector(".navbar-container");
    if (window.scrollY > 50) {
      navbarContainer.classList.add("scrolled");
    } else {
      navbarContainer.classList.remove("scrolled");
    }
  }

  changeLanguage() {
    localStorage.setItem("selectedLanguage", this.selectedLanguage);
    this.translateService.use(this.selectedLanguage);
  }
  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const html = document.getElementsByTagName("html")[0];
    setTimeout(function () {
      toggleButton.classList.add("toggled");
    }, 500);
    html.classList.add("nav-open");

    this.sidebarVisible = true;
  }
  sidebarClose() {
    const html = document.getElementsByTagName("html")[0];

    this.toggleButton.classList.remove("toggled");
    this.sidebarVisible = false;
    html.classList.remove("nav-open");
  }
  sidebarToggle() {
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  }
}

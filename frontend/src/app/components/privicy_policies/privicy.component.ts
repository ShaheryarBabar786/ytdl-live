import { Component, OnInit } from "@angular/core";
import * as Rellax from "rellax";

@Component({
  selector: "app-Privicy",
  templateUrl: "./privicy.component.html",
  styleUrls: ["./privicy.component.scss"],
})
export class PrivicyComponent implements OnInit {
  data: Date = new Date();
  focus;
  focus1;

  constructor() {}

  ngOnInit() {
    var rellaxHeader = new Rellax(".rellax-header");

    var body = document.getElementsByTagName("body")[0];
    body.classList.add("Privicy-page");
    var navbar = document.getElementsByTagName("nav")[0];
    navbar.classList.add("navbar-transparent");
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("Privicy-page");
    var navbar = document.getElementsByTagName("nav")[0];
    navbar.classList.remove("navbar-transparent");
  }
}

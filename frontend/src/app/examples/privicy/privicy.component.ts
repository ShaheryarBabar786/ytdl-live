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
    var navbar = document.getElementsByTagName("nav")[0];
    navbar.classList.add("navbar-transparent");
  }
  ngOnDestroy() {
    var navbar = document.getElementsByTagName("nav")[0];
    navbar.classList.remove("navbar-transparent");
  }
}

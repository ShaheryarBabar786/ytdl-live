import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-Disclaimer",
  templateUrl: "./Disclaimer.component.html",
  styleUrls: ["./Disclaimer.component.scss"],
})
export class DisclaimerComponent implements OnInit {
  data: Date = new Date();
  focus;
  focus1;

  constructor() {}

  ngOnInit() {}
  ngOnDestroy() {}
}

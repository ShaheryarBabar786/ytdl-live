import { Component, OnInit } from "@angular/core";
import * as Rellax from "rellax";
import emailjs, { type EmailJSResponseStatus } from "@emailjs/browser";
import Swal from "sweetalert2";

@Component({
  selector: "app-Contact",
  templateUrl: "./contact-us.component.html",
  styleUrls: ["./contact-us.component.scss"],
})
export class ContactComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
  ngOnDestroy() {}

  public sendEmail(e: Event, form: HTMLFormElement) {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_unjbf7u",
        "template_n0ayhfs",
        e.target as HTMLFormElement,
        {
          publicKey: "BOUliRMJOJWJpZIKA",
        }
      )
      .then(
        () => {
          Swal.fire({
            title: "Sent!",
            text: "Email sent successfully!",
            icon: "success",
          }).then(() => {
            form.reset();
          });
        },
        (error) => {
          console.log("FAILED...", (error as EmailJSResponseStatus).text);
        }
      );
  }
}

import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import emailjs, { EmailJSResponseStatus } from "@emailjs/browser";
import Swal from "sweetalert2";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-Contact",
  templateUrl: "./contact-us.component.html",
  styleUrls: ["./contact-us.component.scss"],
})
export class ContactComponent implements OnInit {
  selectedLanguage: string = "en";
  data: Date = new Date();

  constructor(private translateService: TranslateService) {
    this.selectedLanguage = "en";
  }

  ngOnInit() {}
  ngOnDestroy() {}

  public sendEmail(e: Event, form: NgForm) {
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
            form.resetForm();
          });
        },
        (error) => {
          console.log("FAILED...", (error as EmailJSResponseStatus).text);
        }
      );
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

import {
  Component,
  OnInit,
  Renderer2,
  OnDestroy,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { NgbAccordionConfig } from "@ng-bootstrap/ng-bootstrap";
import * as Rellax from "rellax";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { YtServiceService } from "app/services/yt-service.service";
import { saveAs } from "file-saver";
import { map } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-components",
  templateUrl: "./components.component.html",
  styleUrls: ["./components.component.scss"],

  styles: [
    `
      ngb-progressbar {
        margin-top: 5rem;
      }
    `,
  ],
})
export class ComponentsComponent implements OnInit, OnDestroy {
  resolutionOptions: { resolution: string; itag: string }[] = [];
  audioQualities: { label: string; value: string }[] = [];
  thumbnailUrl: string;
  videoTitle: string;
  selectedFormat: string;
  selectedResolution: string;
  selectedQuality: string;
  closeResult: string;
  data: Date = new Date();
  videoURL: string;
  videoDuration: string;
  videoDescription: string;
  showFullDescription = false;
  truncatedVideoDescription: string;
  loading = false;
  errorMessage: string = "";
  page = 4;
  page1 = 5;
  page2 = 3;
  focus;
  focus1;
  focus2;
  date: { year: number; month: number };
  model: NgbDateStruct;
  public isCollapsed = true;
  public isCollapsed1 = true;
  public isCollapsed2 = true;
  state_icon_primary = true;
  downloading: boolean = false;
  downloadProgress: number = 0;
  selectedLanguage: string = "en";
  isDownloadDisabled: boolean = true;
  showResolutionSelect: boolean = true;
  isShortsVideo: boolean;

  constructor(
    private renderer: Renderer2,
    config: NgbAccordionConfig,
    private modalService: NgbModal,
    private ytService: YtServiceService,
    private translateService: TranslateService,
    private route: ActivatedRoute
  ) {
    config.closeOthers = true;
    config.type = "info";
    this.selectedFormat = "mp4";
    this.selectedLanguage = "en";
  }
  changeLanguage() {
    this.translateService.use(this.selectedLanguage);
  }
  isWeekend(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }
  isDisabled(date: NgbDateStruct, current: { month: number }) {
    return date.month !== current.month;
  }
  ngOnInit() {
    var rellaxHeader = new Rellax(".rellax-header");
    var navbar = document.getElementsByTagName("nav")[0];
    navbar.classList.add("navbar-transparent");
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("index-page");
    this.selectedFormat = "mp4";
    this.selectedResolution = "22";
  }
  ngOnDestroy() {
    var navbar = document.getElementsByTagName("nav")[0];
    navbar.classList.remove("navbar-transparent");
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("index-page");
  }
  checkDownloadDisabled() {
    this.isDownloadDisabled = !(!this.loading && this.thumbnailUrl);
  }

  // onInputChanged() {
  //   this.loading = true;
  //   this.errorMessage = "";
  //   if (this.videoURL && this.videoURL.trim() !== "") {
  //     setTimeout(() => {
  //       this.ytService.downloadBasicVideoDetails(this.videoURL).subscribe(
  //         (data) => {
  //           if (data) {
  //             this.thumbnailUrl = data.thumbnail;
  //             this.videoTitle = data.title;
  //             this.loading = false;
  //             this.truncateDescription();

  //             this.linkDetail();
  //           } else {
  //             console.error("Invalid data received:", data);
  //             this.errorMessage = "Invalid data received. Please try again.";
  //             this.loading = false;
  //           }
  //         },
  //         (error) => {
  //           console.error("Error fetching data:", error);
  //           this.errorMessage =
  //             "Error fetching data. Please check the URL and try again.";
  //           this.loading = false;
  //         }
  //       );
  //     }, 2000);
  //   } else {
  //     this.errorMessage = "Please enter a valid URL.";
  //     this.loading = false;
  //   }
  // }
  onInputChanged() {
    this.loading = true;
    this.errorMessage = "";
    if (this.videoURL && this.videoURL.trim() !== "") {
      console.log(this.videoURL);
      // Check if the URL contains the word 'shorts'
      const isShortsVideo = this.videoURL.includes("/shorts/");
      console.log(isShortsVideo);
      if (isShortsVideo) {
        // If it's a shorts video, hide the resolution select
        this.showResolutionSelect = false;
        this.isShortsVideo = true;
      } else {
        // Otherwise, show the resolution select
        this.showResolutionSelect = true;
        this.isShortsVideo = false;
      }

      setTimeout(() => {
        this.ytService.downloadBasicVideoDetails(this.videoURL).subscribe(
          (data) => {
            if (data) {
              this.thumbnailUrl = data.thumbnail;
              this.videoTitle = data.title;
              this.loading = false;
              this.truncateDescription();

              this.linkDetail();
            } else {
              console.error("Invalid data received:", data);
              this.errorMessage = "Invalid data received. Please try again.";
              this.loading = false;
            }
          },
          (error) => {
            console.error("Error fetching data:", error);
            this.errorMessage =
              "Error fetching data. Please check the URL and try again.";
            this.loading = false;
          }
        );
      }, 2000);
    } else {
      this.errorMessage = "Please enter a valid URL.";
      this.loading = false;
    }
  }

  onInput(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    if (!inputValue.trim()) {
      window.location.reload();
    }
  }

  linkDetail() {
    this.ytService.downloadFullVideoDetails(this.videoURL).subscribe(
      (data) => {
        this.thumbnailUrl = data.thumbnail;
        this.videoTitle = data.title;
        this.videoDuration = this.formatVideoDuration(data.duration); // Ensure formatVideoDuration is defined
        this.videoDescription = data.description;
        this.truncateDescription();
        this.loadResolutions();
      },
      (error) => {
        console.error("Error fetching data:", error);
        this.errorMessage =
          "No data found. Please check the URL and try again.";
      }
    );
  }

  open(content, type) {
    this.modalService.open(content, { size: "md" }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  containsShorts(url: string): boolean {
    return url.includes("/shorts/");
  }
  formatChange() {
    if (this.selectedFormat === "mp4") {
      this.showResolutionSelect = true;
      if (this.containsShorts(this.videoURL)) {
        console.log(this.videoURL);
        this.showResolutionSelect = false; // Hide resolution select for 'shorts' URLs
      }
    } else {
      this.showResolutionSelect = false;
    }
  }

  truncateDescription() {
    const maxLength = 100;
    if (this.videoDescription.length > maxLength) {
      this.truncatedVideoDescription =
        this.videoDescription.substring(0, maxLength) + "...";
    } else {
      this.truncatedVideoDescription = this.videoDescription;
    }
  }
  toggleDescription() {
    this.showFullDescription = !this.showFullDescription;
  }
  formatVideoDuration(durationInSeconds: number): string {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;
    const formattedDuration = `${hours}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    return formattedDuration;
  }

  resolutionChange(resolution: string) {
    this.selectedResolution = resolution;
  }

  loadResolutions() {
    this.ytService.getResolutions(this.videoURL).subscribe(
      (data) => {
        this.resolutionOptions = data
          .filter((option) => option.itag === 22 || option.itag === 18)
          .map((option) => ({
            ...option,
            audioAvailable: option.audioBitrate !== null,
          }));
        console.log(data);
      },

      (error) => {
        console.error("Error fetching resolutions:", error);
      }
    );
  }

  downloadVideo() {
    if (this.selectedFormat === "mp4") {
      this.downloading = true;
      this.downloadProgress = 0;

      this.ytService
        .downloadVideo(this.videoURL, this.selectedResolution)
        .subscribe(
          (event: any) => {
            if (event.type === "downloadProgress") {
              this.downloadProgress = Math.round(
                (event.loaded / event.total) * 100
              );
            } else if (event instanceof Blob) {
              this.downloadBlob(event, "video.mp4");
              this.downloading = false;
            }
          },
          (error) => {
            console.error("Error downloading video:", error);
            this.downloading = false;
          }
        );
    } else if (this.selectedFormat === "mp3") {
      this.downloading = true;
      this.downloadProgress = 0;

      this.ytService.downloadAudio(this.videoURL).subscribe(
        (event: any) => {
          if (event.type === "downloadProgress") {
            this.downloadProgress = Math.round(
              (event.loaded / event.total) * 100
            );
          } else if (event instanceof Blob) {
            this.downloadBlob(event, "audio.mp3");
            this.downloading = false;
          }
        },
        (error) => {
          console.error("Error downloading audio:", error);
          this.downloading = false;
        }
      );
    }
  }

  downloadShortsVideo() {
    console.log("short start");
    if (this.selectedFormat === "mp4") {
      this.downloading = true;
      this.downloadProgress = 0;

      this.ytService.downloadShortMp4(this.videoURL).subscribe(
        (event: any) => {
          if (event.type === "downloadProgress") {
            this.downloadProgress = Math.round(
              (event.loaded / event.total) * 100
            );
          } else if (event instanceof Blob) {
            this.downloadBlob(event, "short_video.mp4");
            this.downloading = false;
            console.log("video download");
          }
        },
        (error) => {
          console.error("Error downloading shorts video:", error);
          this.downloading = false;
        }
      );
    } else if (this.selectedFormat === "mp3") {
      this.downloading = true;
      this.downloadProgress = 0;
      console.log("shorts for mp3");

      this.ytService.downloadAudio(this.videoURL).subscribe(
        (event: any) => {
          if (event.type === "downloadProgress") {
            this.downloadProgress = Math.round(
              (event.loaded / event.total) * 100
            );
          } else if (event instanceof Blob) {
            this.downloadBlob(event, "shorts_audio.mp3");
            this.downloading = false;
          }
        },
        (error) => {
          console.error("Error downloading audio:", error);
          this.downloading = false;
        }
      );
    }
  }

  private downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}

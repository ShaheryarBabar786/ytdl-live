import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { NgbAccordionConfig } from "@ng-bootstrap/ng-bootstrap";

import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { YtServiceService } from "app/services/yt-service.service";
import { TranslateService } from "@ngx-translate/core";
import { HttpEventType } from "@angular/common/http";
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
  @ViewChild("section1") section1: ElementRef;
  @ViewChild("section2") section2: ElementRef;

  sectionToScroll: ElementRef;

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
  hasDescription: boolean;
  isImageFullScreen: boolean = false;
  fullscreenImageSrc: string = "";
  totalByte: any;
  totalBytesforshorts: any;
  totalBytesForMP3: any;
  constructor(
    config: NgbAccordionConfig,
    private modalService: NgbModal,
    private ytService: YtServiceService,
    private translateService: TranslateService
  ) {
    config.closeOthers = true;
    config.type = "info";
    this.selectedFormat = "mp4";
    this.selectedLanguage = "en";
  }

  ngAfterViewInit() {
    if (this.sectionToScroll) {
      this.sectionToScroll.nativeElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  clearErrorMessageAfterDelay() {
    setTimeout(() => {
      this.errorMessage = "";
    }, 5000);
  }

  openImageFullScreen(imageSrc: string) {
    this.isImageFullScreen = true;
    this.fullscreenImageSrc = imageSrc;
  }

  closeImageFullScreen() {
    this.isImageFullScreen = false;
    this.fullscreenImageSrc = "";
  }

  scrollToSection(sectionName: string) {
    const sectionElement = document.querySelector(`#${sectionName}`);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  resolutionOptions: { resolution: string; itag: string }[] = [
    // { resolution: "720p", itag: "22" },
    // { resolution: "360p", itag: "18" },
  ];
  resolutionChange(resolution: string) {
    this.selectedResolution = resolution;
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
    var navbar = document.getElementsByTagName("nav")[0];
    navbar.classList.add("navbar-transparent");
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("index-page");
    this.selectedFormat = "mp4";
    // this.selectedResolution = "22";
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

  onInputChanged() {
    this.loading = true;
    this.errorMessage = "";
    if (this.videoURL && this.videoURL.trim() !== "") {
      const isShortsVideo = this.videoURL.includes("/shorts/");
      if (isShortsVideo) {
        this.showResolutionSelect = false;
        this.isShortsVideo = true;
      } else {
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
              this.errorMessage = this.translateService.instant(
                "error.oninputchangedfun"
              );

              this.loading = false;
              this.clearErrorMessageAfterDelay();
            }
          },
          (error) => {
            this.errorMessage = this.translateService.instant(
              "error.oninputchangedfun2"
            );

            this.loading = false;
            this.clearErrorMessageAfterDelay();
          }
        );
      }, 2000);
    } else {
      this.errorMessage = this.translateService.instant(
        "error.oninputchangedfun3"
      );

      this.loading = false;
      this.clearErrorMessageAfterDelay();
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
        this.videoDuration = this.formatVideoDuration(data.duration);
        this.videoDescription = data.description;
        this.truncateDescription();
        this.hasDescription = !!data.description;
      },
      (error) => {
        console.error("Error fetching data:", error);
        this.errorMessage = this.translateService.instant(
          "error.linkdetailfun"
        );
        this.clearErrorMessageAfterDelay();
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
        this.showResolutionSelect = false;
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

  getByte() {
    this.ytService
      .getByte(this.videoURL, this.selectedResolution)
      .subscribe((res: any) => {
        this.totalByte = res;
      });
  }

  getByteforshorts() {
    this.ytService.getByteforshorts(this.videoURL).subscribe((res: any) => {
      this.totalBytesforshorts = res;
    });
  }
  getByteForMP3() {
    this.ytService.getByteForMP3(this.videoURL).subscribe((res: any) => {
      this.totalBytesForMP3 = res.totalBytesForMP3;
    });
  }

  getresolutions() {
    this.ytService.resolutions(this.videoURL).subscribe((res: any) => {
      this.resolutionOptions = res.resolutionsWithAudioAndVideo;
      const resolution = this.resolutionOptions.find(
        (resolution) => resolution.itag === "22"
      );
      if (resolution) {
        this.selectedResolution = "22";
      } else {
        this.selectedResolution = "18";
      }
    });
  }

  downloadVideo() {
    this.getByte();
    if (this.selectedFormat === "mp4") {
      this.downloading = true;
      this.downloadProgress = 0;
      this.ytService
        .downloadVideo(this.videoURL, this.selectedResolution)
        .subscribe(
          (event: any) => {
            if (event.type === HttpEventType.DownloadProgress) {
              this.downloadProgress = Math.round(
                (event.loaded / this.totalByte) * 100
              );
            } else if (event.type === HttpEventType.Response) {
              this.downloading = false;
              this.downloadBlob(event.body, "video.mp4");
            }
          },
          (error) => {
            console.error("Error downloading video:", error);
            this.downloading = false;
            this.errorMessage = this.translateService.instant(
              "error.downloadmp4fun"
            );
            this.clearErrorMessageAfterDelay();
          }
        );
    } else if (this.selectedFormat === "mp3") {
      this.getByteForMP3();
      this.downloading = true;
      this.downloadProgress = 0;
      this.ytService.downloadAudio(this.videoURL).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.DownloadProgress) {
            this.downloadProgress = Math.round(
              (event.loaded / this.totalBytesForMP3) * 100
            );
          } else if (event.type === HttpEventType.Response) {
            this.downloadBlob(event.body, "audio.mp3");
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
    this.getByteforshorts();
    if (this.selectedFormat === "mp4") {
      this.downloading = true;
      this.downloadProgress = 0;
      this.ytService.downloadShortMp4(this.videoURL).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.DownloadProgress) {
            this.downloadProgress = Math.round(
              (event.loaded / this.totalBytesforshorts) * 100
            );
          } else if (event.type === HttpEventType.Response) {
            this.downloading = false;
            this.downloadBlob(event.body, "short_video.mp4");
          }
        },
        (error) => {
          console.error("Error downloading shorts video:", error);
          this.downloading = false;
        }
      );
    } else if (this.selectedFormat === "mp3") {
      this.getByteForMP3();
      this.downloading = true;
      this.downloadProgress = 0;
      this.ytService.downloadAudio(this.videoURL).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.DownloadProgress) {
            this.downloadProgress = Math.round(
              (event.loaded / this.totalBytesForMP3) * 100
            );
          } else if (event.type === HttpEventType.Response) {
            this.downloadBlob(event.body, "shorts_audio.mp3");
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

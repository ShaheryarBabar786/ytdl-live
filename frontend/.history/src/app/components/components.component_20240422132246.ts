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
  isDownloadDisabled: boolean = true;

  constructor(
    private renderer: Renderer2,
    config: NgbAccordionConfig,
    private modalService: NgbModal,
    private ytService: YtServiceService
  ) {
    config.closeOthers = true;
    config.type = "info";
    this.selectedFormat = "mp4";
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
    this.selectedResolution = "137";
  }
  ngOnDestroy() {
    var navbar = document.getElementsByTagName("nav")[0];
    navbar.classList.remove("navbar-transparent");
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("index-page");
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
  formatChange() {
    if (this.selectedFormat === "mp4") {
      this.selectedResolution = "1080";
    } else if (this.selectedFormat === "mp3") {
      this.selectedQuality = "320";
    }
  }

  onInputChanged() {
    this.loading = true;
    this.errorMessage = "";
  
    if (this.videoURL && this.videoURL.trim() !== "") {
      setTimeout(() => {
        this.ytService.downloadVideoDetails(this.videoURL).subscribe(
          (data) => {
            if (data) {
              this.thumbnailUrl = data.thumbnail;
              this.videoTitle = data.title;
              this.videoDuration = data.duration ?? ''; // Safely access duration
              this.videoDescription = data.description ?? ''; // Safely access description
              this.truncateDescription();
  
              this.loading = false;
              this.isDownloadDisabled = false; // Enable download button
            } else {
              console.error("Invalid data received:", data);
              this.errorMessage = "Invalid data received. Please try again.";
              this.loading = false;
            }
          },
          (error) => {
            console.error("Error fetching data:", error);
            this.errorMessage = "Error fetching data. Please check the URL and try again.";
            this.loading = false;
          }
        );
      }, 2000);
    } else {
      this.errorMessage = "Please enter a valid URL.";
      this.loading = false;
      this.isDownloadDisabled = true; // Disable download button
    }
  }
  

  onInput(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    if (!inputValue.trim()) {
      window.location.reload();
    }
  }

  linkDetail() {
    this.ytService.downloadVideoDetails(this.videoURL).subscribe(
      (data) => {
        this.thumbnailUrl = data.thumbnail;
        this.videoTitle = data.title;
        this.videoDuration = this.formatVideoDuration(data.duration);
        this.videoDescription = data.description;
        this.truncateDescription();
        this.loadResolutions(); // Fetch resolutions after getting video details
        this.fetchAudioQualities(this.videoURL);
      },
      (error) => {
        console.error("Error fetching data:", error);
        this.errorMessage =
          "No data found. Please check the URL and try again.";
      }
    );
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
        this.resolutionOptions = data.map((option) => ({
          ...option,
          audioAvailable: option.audioBitrate !== null, // Check if audioBitrate is not null
        }));
      },
      (error) => {
        console.error("Error fetching resolutions:", error);
      }
    );
  }
  fetchAudioQualities(videoURL: string) {
    this.ytService.getAudioQualities(videoURL).subscribe(
      (data) => {
        console.log("audio quality", data);
        this.audioQualities = data
          .filter((quality) => quality.audioQuality !== "undefinedkbps")
          .map((quality) => ({
            label: quality.audioQuality,
            value: quality.itag,
          }));
      },
      (error) => {
        console.error("Error fetching audio qualities:", error);
        // Handle the error, such as displaying a message to the user
      }
    );
  }

  downloadVideo(resolution: string) {
    console.log("download button clicked");
    if (this.selectedFormat === "mp4") {
      const itag = resolution; // Use the selected resolution as the itag

      this.ytService
        .downloadVideo(this.videoURL, this.selectedResolution)
        .subscribe(
          (data) => {
            console.log(data);
            
          },
          (error) => {
            console.error("Error downloading audio:", error);
          }
          // (blob) => this.downloadBlob(blob, "video.mp4"),
          // (error) => console.error("Error downloading video:", error)
        );
    } else if (this.selectedFormat === "mp3") {
      this.ytService.downloadAudio(this.videoURL).subscribe(
        (data) => {
          console.log(data);
        },
        (error) => {
          console.error("Error downloading audio:", error);
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

import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from "@angular/common/http";
import { Observable, map } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class YtServiceService {
  url = environment.url;

  constructor(private http: HttpClient) {}
  downloadAudio(audioURL: string): Observable<Blob> {
    const params = { audioURL };
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    return this.http.get(`${this.url}mp3/downloadAudio`, {
      params,
      headers,
      responseType: "blob",
    });
  }
  downloadVideo(videoURL: string, itag: string): Observable<Blob> {
    const body = { videoURL, itag }; // Request body with videoURL and itag
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    return this.http.post(this.url + "download", body, {
      headers,
      responseType: "blob",
    });
  }

  // downloadAudio(videoURL: string, audioQuality: string): Observable<any> {
  //   return this.http.get<any>(`${this.url}downloadmp3`, {
  //     params: { videoURL, audioQuality },
  //   });
  // }
  // downloadVideoDetails(videoURL: string): Observable<any> {
  //   return this.http.get<any>(`${this.url}videoDetail/details`, {
  //     params: { videoURL },
  //   });
  // }
  downloadBasicVideoDetails(videoURL: string): Observable<any> {
    return this.http.get<any>(`${this.url}videoDetail/details`, {
      params: { videoURL },
    });
  }
  downloadFullVideoDetails(videoURL: string): Observable<any> {
    return this.http.get<any>(`${this.url}videoDetail/fullDetails`, {
      params: { videoURL },
    });
  }
  

  getResolutions(videoURL: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}videoDetail/resolutions`, {
      params: { videoURL },
    });
  }

  getAudioQualities(videoURL: string): Observable<any> {
    return this.http.get<any>(`${this.url}videoDetail/audio-qualities`, {
      params: { videoURL },
    });
  }
}

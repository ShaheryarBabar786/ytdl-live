import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from "@angular/common/http";
import { Observable, map, tap } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class YtServiceService {
  url = environment.url;

  constructor(private http: HttpClient) {}
  downloadAudio(videoURL: string): Observable<Blob> {
    const params = new HttpParams().set("videoURL", videoURL);
    return this.http.get(`${this.url}mp3/downloadAudio`, {
      params,
      responseType: "blob",
    });
  }
  // downloadVideo(videoURL: string, itag: string): Observable<Blob> {
  //   const body = { videoURL, itag }; // Request body with videoURL and itag
  //   const headers = new HttpHeaders().set("Content-Type", "application/json");

  //   return this.http.post(this.url + "download/downloadvideomp4", body, {
  //     headers,
  //     responseType: "blob",
  //   });
  // }
  downloadVideo(videoURL: string, itag: string): Observable<HttpEvent<Blob>> {
    const body = { videoURL, itag };
    const headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.url + "download/downloadvideomp4", body, {
      headers,
      reportProgress: true,
      responseType: "blob",
      observe: "events",
    });
  }

  getByte(videoURL: string, itag: any) {
    const body = { videoURL, itag };
    return this.http.post(this.url + "download/getByte", body);
  }
  downloadShortMp4(videoURL: string): Observable<Blob> {
    const body = { videoURL };
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    return this.http.post(`${this.url}download/downloadshortmp4`, body, {
      headers,
      responseType: "blob",
    });
  }
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
}

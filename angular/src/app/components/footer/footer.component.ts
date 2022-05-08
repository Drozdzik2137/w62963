import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    scrollwheel: false,
    center: {lat: 50.048924580103346, lng: 21.981803279444392},
    zoom: 15,
  }
  apiLoaded: Observable<boolean>;
  markerOptions: google.maps.MarkerOptions = {clickable: false, optimized: false, title: 'WSIiZ' };
  markerPositions: google.maps.LatLngLiteral[] = [];
  center: google.maps.LatLngLiteral = {lat: 50.048924580103346, lng: 21.981803279444392};

  constructor(http: HttpClient) {
    this.apiLoaded = http.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyAPzf55-x7RnpsDjG9yMj7ZHuYXyvUXSxQ', 'callback')
    .pipe(
      map(() => true),
      catchError(() => of(false)),
    );
  }

  ngOnInit(): void {
    this.markerPositions.push(this.center);
  }

}

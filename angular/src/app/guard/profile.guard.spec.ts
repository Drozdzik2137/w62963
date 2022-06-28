import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { ProfileGuard } from './profile.guard';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';

describe('ProfileGuard', () => {
  let guard: ProfileGuard;
  let http: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [ProfileGuard, { provide: ToastrService, useValue: ToastrService }]
    });
    guard = TestBed.inject(ProfileGuard);
    http = TestBed.inject(HttpClient)
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

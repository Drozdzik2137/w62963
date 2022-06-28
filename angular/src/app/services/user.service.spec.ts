import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { ToastrService } from 'ngx-toastr';

describe('UserService', () => {
  let service: UserService;
  let http: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [UserService, { provide: ToastrService, useValue: ToastrService }],
    });
    service = TestBed.inject(UserService);
    http = TestBed.inject(HttpClient)
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });
});

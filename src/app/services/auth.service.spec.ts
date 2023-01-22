import {TestBed} from '@angular/core/testing';

import {AuthService} from './auth.service';
import {AppConfigService} from "../../config/app-config.service";
import {createSpyFromClass, Spy} from "jasmine-auto-spies";
import {HttpClient} from "@angular/common/http";
import {JwtHelperService, JwtModule} from "@auth0/angular-jwt";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {tokenGetter} from "../app.module";
import {Jwt} from "../models/jwt";
import {AppConfig} from "../../config/app-config";

/**
 * Тестирование сервиса для работы с аутентификацией.
 */
describe('AuthService', () => {
  let authService: AuthService;
  let httpSpy: Spy<HttpClient>;
  let jwtSpy: Spy<JwtHelperService>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ["localhost:7150"],
          disallowedRoutes: []
        }
      }),],
      providers: [AuthService, JwtHelperService, {
        provide: HttpClient,
        useValue: createSpyFromClass(HttpClient)
      }]
    });

    httpSpy = TestBed.inject<any>(HttpClient);
    jwtSpy = TestBed.inject<any>(JwtHelperService);
    httpMock = TestBed.inject(HttpTestingController);

    authService = new AuthService(httpSpy, jwtSpy);
  });

  afterEach(() => {
    httpMock.verify();
  });

  /**
   * Тестирование метода на проверку валидности токена.
   */
  describe('IsTokenVerification()', () => {
    it('should return true - if the token is valid, false otherwise', () => {
      let jwt: Jwt = {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
          'eyJJZCI6IjYxNjA0ODM3LTU2OGEtNGQ5Ny04NTUzLWFmYzhiNWRkMmVjNyIsIkxvZ2luIjoiMTIzIiwiZXhwIjoxNjcyMTk4NzM1LCJpc3MiOiJDb2ZmZWVNYWNoaW5lIiwiYXVkIjoiQ29mZmVlTWFjaGluZUNsaWVudCJ9.' +
          'xcm5jja9oZmI6eqkfx08FjDkBYULEsdSSxVgrB61VKg',
        refreshToken: 'akGSAX1izjBSN/V3OvDZky5FoAANxtT1xppBCzS9uFQ='
      }

      localStorage.setItem("accessToken", jwt.accessToken);

      let isTokenValid = authService.IsTokenVerification();

      expect(isTokenValid).toBeFalse();
    });
  });

  /**
   * Тестирование метода на получение токена доступа.
   */
  describe('getAccessToken()', () => {
    it('should return access token', () => {
      let jwt: Jwt = {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
          'eyJJZCI6IjYxNjA0ODM3LTU2OGEtNGQ5Ny04NTUzLWFmYzhiNWRkMmVjNyIsIkxvZ2luIjoiMTIzIiwiZXhwIjoxNjcyMTk4NzM1LCJpc3MiOiJDb2ZmZWVNYWNoaW5lIiwiYXVkIjoiQ29mZmVlTWFjaGluZUNsaWVudCJ9.' +
          'xcm5jja9oZmI6eqkfx08FjDkBYULEsdSSxVgrB61VKg',
        refreshToken: 'akGSAX1izjBSN/V3OvDZky5FoAANxtT1xppBCzS9uFQ='
      }

      localStorage.setItem("accessToken", jwt.accessToken);

      let token = authService.getAccessToken();

      expect(token).toEqual(jwt.accessToken);
    });
  });
});

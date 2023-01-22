import {TestBed} from '@angular/core/testing';

import {SignUpService} from './sign-up.service';
import {AppConfigService} from "../../config/app-config.service";
import {createSpyFromClass, Spy} from "jasmine-auto-spies";
import {HttpClient} from "@angular/common/http";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {SignUp} from "../models/sign-up";
import {AppConfig} from "../../config/app-config";

/**
 * Тестирование сервиса для работы с регистрацией.
 */
describe('SignUpService', () => {
  let signUpService: SignUpService;
  let fakeAppConfigService = {getConfig: () => new AppConfig()};
  let httpSpy: Spy<HttpClient>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SignUpService, {
        provide: HttpClient,
        useValue: createSpyFromClass(HttpClient)
      }]
    });
    httpSpy = TestBed.inject<any>(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);

    signUpService = new SignUpService(httpSpy, fakeAppConfigService as AppConfigService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  /**
   * Тестирование метода на добавление нового пользователя.
   */
  describe('addUser(user: ISignUp)', () => {
    it('should return new user', () => {
      let dummySingUpUser: SignUp = {
        login: 'Bob',
        name: 'Боб',
        password: 'pokarty'
      };

      httpSpy.post.and.nextWith(dummySingUpUser);

      signUpService.addUser(dummySingUpUser).subscribe((user) =>
        expect(user.login).toEqual(dummySingUpUser.login));

      expect(httpSpy.post.calls.count()).toBe(1);
    });
  });
});

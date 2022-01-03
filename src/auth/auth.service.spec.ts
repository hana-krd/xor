import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../database/schemas/user.schema';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';

const mockUser: User = {
  email: 'test@test.com',
  password: '$2b$10$Wap4dyOtXzfeq5PUPm81neaI29JmmuW13ml/EVgwi2XjadHuoakdS',
  avatar: '',
  _id: '61cd75047d4b573f4f376f67',
  name: 'testUser',
  middleName: '',
  family: 'testFamily',
  mobile: '+1 234 56 78',
  nationality: '123456789',
  nationalCode: '123',
  income: 0,
  salt: '$2b$10$Wap4dyOtXzfeq5PUPm81ne',
  extraInfo: {},
};

const password = '@a1b2c3d4e5@A1';
const wrongPassword = 'wrongPassword';
const email = 'test@test.com';
const wrongEmail = 'wrong@test.com';
const userId = '61cd75047d4b573f4f376f67';
const wrongUserId = 'wrongUserId';
const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWNkNzUwNDdkNGI1NzNmNGYzNzZmNjciLCJpYXQiOjE2NDA4NTQ3ODgsImV4cCI6MTY0OTQ5NDc4OH0.zrnNtoBh7hRDTmM1aNDSokniwoTisXSKtFA-xrAPs1Q';
const otp = '112233';

const mockSignInResult = {
  access_token: accessToken,
  user: mockUser,
};

const mockJwtService = () => ({
  sign: jest.fn().mockResolvedValue(accessToken),
});

const mockMailService = () => ({
  sendOtp: jest.fn(),
});

const mockUserService = () => ({
  findUserByUsername: jest.fn().mockResolvedValue(mockUser),
  findUserById: jest.fn().mockResolvedValue(mockUser),
  newOtp: jest.fn().mockResolvedValue(otp),
  createUser: jest.fn(),
  validateOtp: jest.fn(),
});

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let mailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useFactory: mockJwtService,
        },
        {
          provide: MailService,
          useFactory: mockMailService,
        },
        {
          provide: UserService,
          useFactory: mockUserService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    mailService = module.get<MailService>(MailService);
  });

  describe('validateByUsernameAndPassword', () => {
    it('check user exists or not using username & password', async () => {
      expect(userService.findUserByUsername).not.toBeCalled();

      const result = await authService.validateByUsernameAndPassword(
        email,
        password,
      );

      expect(userService.findUserByUsername).toBeCalledTimes(1);
      expect(userService.findUserByUsername).toBeCalledWith(email);
      expect(result).toEqual(mockUser);
    });

    it('check user not found, password is wrong', async () => {
      const result = await authService.validateByUsernameAndPassword(
        email,
        wrongPassword,
      );

      expect(result).toEqual(null);
    });

    it('check user not found, email is wrong', async () => {
      userService.findUserByUsername = jest.fn().mockResolvedValue(null);

      const result = await authService.validateByUsernameAndPassword(
        wrongEmail,
        password,
      );

      expect(result).toEqual(null);
    });

    it('check user not found, email and password are wrong', async () => {
      userService.findUserByUsername = jest.fn().mockResolvedValue(null);

      const result = await authService.validateByUsernameAndPassword(
        wrongEmail,
        wrongPassword,
      );

      expect(result).toEqual(null);
    });
  });

  describe('validateByUserId', () => {
    it('find user by id', async () => {
      const result = await authService.validateByUserId(userId);
      expect(result).toEqual(mockUser);
    });

    it('user not found', async () => {
      userService.findUserById = jest
        .fn()
        .mockRejectedValue(new NotFoundException(`User not found`));

      await expect(
        authService.validateByUserId(wrongUserId),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('signIn', () => {
    it('signIn successfully', async () => {
      const result = await authService.signIn(mockUser);
      expect(jwtService.sign).toBeCalledTimes(1);
    });
  });

  describe('signUp', () => {
    let signupDto: SignUpDto;
    beforeEach(() => {
      signupDto = {
        email: password,
        password: email,
      };
    });

    it('signUp successfully', async () => {
      userService.createUser = jest.fn().mockResolvedValue(mockUser);
      mailService.sendOtp = jest.fn().mockResolvedValue(true);
      authService.signIn = jest.fn().mockResolvedValue(mockSignInResult);

      const result = await authService.signUp(signupDto);

      expect(result).toEqual(mockSignInResult);
      expect(authService.signIn).toBeCalled();
    });

    it('user already exists', async () => {
      userService.createUser = jest
        .fn()
        .mockRejectedValue(new ConflictException(`User already exists`));

      await expect(authService.signUp(signupDto)).rejects.toThrowError(
        ConflictException,
      );
    });
  });

  describe('verifyEmail', () => {
    it('Email already verified, throw error', async () => {
      mockUser.extraInfo = {
        isEmailVerified: true,
      };

      await expect(
        authService.verifyEmail(mockUser, {
          otp: otp,
        }),
      ).rejects.toThrowError(BadRequestException);
    });

    it('verification is successful', async () => {
      mockUser.extraInfo = {
        isEmailVerified: false,
      };

      userService.validateOtp = jest.fn().mockResolvedValue(true);
      userService.emailVerified = jest.fn();

      const result = await authService.verifyEmail(mockUser, {
        otp: otp,
      });

      expect(result).toEqual(true);
    });
  });

  describe('requestOtp', () => {
    it('Email already verified, throw error', async () => {
      mockUser.extraInfo = {
        isEmailVerified: true,
      };

      await expect(
        authService.requestOtp(mockUser),
      ).rejects.toThrowError(BadRequestException);
    });

    it('successfully sent an otp', async () => {
      mockUser.extraInfo = {
        isEmailVerified: false,
      };

      mailService.sendOtp = jest.fn().mockResolvedValue(true);
      const result = await authService.requestOtp(mockUser);

      expect(result).toEqual(true);
    });
  });
});

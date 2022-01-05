import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { UserRoleDocument } from '../database/schemas/user-role.schema';
import { OrganType } from '../static/enum/organ-type.enum';
import { Roles } from '../static/enum/role.enum';
import { UserRoleDto } from '../user/dto/create-user-role.dto';
import { UserRolesModule } from './user-roles.module';
import { UserRolesService } from './user-roles.service';

const mockUserRoleModel = () => ({
  findOne: jest.fn(),
  populate: jest.fn(),
  exec: jest.fn(),
  deleteOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('UserRolesService', () => {
  let service: UserRolesService;
  let userRoleModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[],
      providers: [
        {
          provide: 'UserRoleModel',
          useFactory: mockUserRoleModel

        },
        UserRolesService
      ],
    }).compile();

    userRoleModel = module.get<'UserRoleModel'>('UserRoleModel');
    service = module.get<UserRolesService>(UserRolesService);
  });

  describe('addRole', () => {
    let findOne;
    let populate;
    let exec;
    let save;

    beforeEach(() => {
      findOne = jest.fn();
      populate = jest.fn();
      exec = jest.fn();
      save = jest.fn();
    });

    it('user role exists, add new role', async () => {
      const mockUserRole = {
        _id: '61cda8a05b97a13874e749e1',
        roles: ['CHARITY_CREATOR', 'OWNER', 'SUPPORT'],
        organType: 'CHARITY',
        organ: '61cda8a05b97a13874e749de',
        user: '61cd75047d4b573f4f376f67',
        createdAt: '2021-12-30T12:40:00.539Z',
        updatedAt: '2021-12-30T12:40:42.194Z',
        __v: 1,
      };

      const mockUserRoleDto = {
        user: '61cd75047d4b573f4f376f67',
        organ: '61cda8a05b97a13874e749de',
        organType: OrganType.CHARITY,
        roles: [Roles.MANAGE_USERS],
        save: save
      };

      exec = jest.fn().mockResolvedValue(mockUserRole);
      userRoleModel.populate = jest.fn().mockResolvedValue(exec);
      userRoleModel.findOne = jest.fn().mockResolvedValue(populate);
    
      const result = await service.addRole(mockUserRoleDto);
      expect(userRoleModel.create).toBeCalled();
      expect(mockUserRoleDto.save).not.toBeCalled();
    
    });

    it('user role exists, roles are not change', async () => {});

    it('user role not exists, create user role and roles', async () => {});
  });

  describe('deleteAllRoles', () => {});

  describe('deleteSomeRoles', () => {});

  describe('getUserRoles', () => {});
});

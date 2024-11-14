import { Repository } from "typeorm";
import { UsersService } from "./users.service"
import { User } from "./user.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { v4 as uuid } from "uuid";
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserSignInDto } from "./dto/user-sign-in.dto";
import { UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";

describe('UsersService', () => {
	let usersService: UsersService;
	let repository: Repository<User>

	const mockUserRepository = {
		find: jest.fn(),
		findOneBy: jest.fn(),
		save: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	};

	const currentDate = new Date().toISOString();
	const mockUser = {
		id: uuid(),
		name: 'John',
		email: 'john.doe@test.com',
		password: 'hashedPassword',
		createdAt: currentDate,
		updatedAt: currentDate,
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: getRepositoryToken(User),
					useValue: mockUserRepository,
				},
			]
		}).compile();

		usersService = module.get<UsersService>(UsersService);
		repository = module.get<Repository<User>>(getRepositoryToken(User));
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(usersService).toBeDefined();
	});

	it('should return all users', async () => {
		mockUserRepository.find.mockResolvedValue([mockUser]);

		const result = await usersService.findAll();
		expect(result).toEqual([mockUser]);
		expect(mockUserRepository.find).toHaveBeenCalledTimes(1);
	});

	it('should return a user by ID', async () => {
		mockUserRepository.findOneBy.mockRejectedValue(mockUser);

		const result = await usersService.findOne(mockUser.id);
		expect(result).toEqual(mockUser);
		expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: mockUser.id });
	});

	it('should return a user by email', async () => {
		mockUserRepository.findOneBy.mockResolvedValue(mockUser);

		const result = await usersService.findByEmail(mockUser.email);
		expect(result).toEqual(mockUser);
		expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email: mockUser.email });
	});

	it('should hash the password and create a new user', async () => {
		const createUserDto: CreateUserDto = {
		  name: 'John',
		  email: 'john.doe@test.com',
		  password: 'John123@',
		};
	
		const hashedPassword = 'hashedPassword';
		jest.spyOn(bcrypt, 'genSalt').mockImplementation(async () => 'salt');
		jest.spyOn(bcrypt, 'hash').mockImplementation(async () => hashedPassword);
		mockUserRepository.save.mockResolvedValue({
		  ...mockUser,
		  ...createUserDto,
		  password: hashedPassword,
		});
	
		const result = await usersService.create(createUserDto);
		expect(result).toMatchObject({
		  ...createUserDto,
		  password: hashedPassword,
		});
		expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 'salt');
		expect(mockUserRepository.save).toHaveBeenCalledWith({
		  name: createUserDto.name,
		  email: createUserDto.email,
		  password: hashedPassword,
		});
	  });

	it('should throw an UnauthorizedException if email is invalid', async () => {
		const userSignInDto: UserSignInDto = { email: 'invalid@test.com', password: 'John123@' };
		mockUserRepository.findOneBy.mockResolvedValue(undefined);

		await expect(usersService.signInUser(userSignInDto)).rejects.toThrow(UnauthorizedException);
	});

	it('should throw an UnauthorizedException if password is invalid', async () => {
		const userSignInDto: UserSignInDto = { email: 'john.doe@test.com', password: 'wrongPassword', };

		mockUserRepository.findOneBy.mockResolvedValue(mockUser);
		jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

		await expect(usersService.signInUser(userSignInDto)).rejects.toThrow(UnauthorizedException)
	});

	it('should update a user and return updated user', async () => {
		const updateData: UpdateUserDto = { name: 'Jane' };
		const updatedUser = { ...mockUser, ...updateData };

		mockUserRepository.update.mockResolvedValue(undefined);
		mockUserRepository.findOneBy.mockResolvedValue(updatedUser);

		const result = await usersService.update(mockUser.id, updateData);
		expect(result).toEqual(updatedUser);
		expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser.id, updateData);
	})

	it('should delete user by ID', async () => {
		const userId = mockUser.id;
		mockUserRepository.delete.mockResolvedValue({ affect: 1 });

		await usersService.delete(userId);
		expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
	});
})
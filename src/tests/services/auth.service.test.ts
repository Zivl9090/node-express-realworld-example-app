import * as bcrypt from 'bcryptjs';
import { createUser, getCurrentUser, login, updateUser } from '../../app/routes/auth/auth.service';
import prismaMock from '../prisma-mock';

describe('AuthService', () => {
  describe('createUser', () => {
    test('should create new user ', async () => {
      // Given
      const user = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        password: '1234',
      };

      const mockedResponse = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        password: '1234',
        bio: null,
        image: null,
        token: '',
        demo: false,
      };

      // When
      // @ts-ignore
      prismaMock.user.create.mockResolvedValue(mockedResponse);

      // Then
      await expect(createUser(user)).resolves.toHaveProperty('token');
    });

    test('should throw an exception when creating a new user with already existing user on same username ', async () => {
      // Given
      const user = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        password: '1234',
      };

      const mockedExistingUser = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        password: '1234',
        bio: null,
        image: null,
        token: '',
        demo: false,
      };

      // When
      prismaMock.user.findUnique.mockResolvedValue(mockedExistingUser);

      // Then
      const error = { email: ['has already been taken'] }.toString();
      await expect(createUser(user)).rejects.toThrow(error);
    });
  });

  describe('login', () => {
    test('should return a token', async () => {
      // Given
      const user = {
        email: 'realworld@me',
        password: '1234',
      };

      const hashedPassword = await bcrypt.hash(user.password, 10);

      const mockedResponse = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        password: hashedPassword,
        bio: null,
        image: null,
        token: '',
        demo: false,
      };

      // When
      prismaMock.user.findUnique.mockResolvedValue(mockedResponse);

      // Then
      await expect(login(user)).resolves.toHaveProperty('token');
    });

    test('should throw an error when no user is found', async () => {
      // Given
      const user = {
        email: 'realworld@me',
        password: '1234',
      };

      // When
      prismaMock.user.findUnique.mockResolvedValue(null);

      // Then
      const error = String({ errors: { 'email or password': ['is invalid'] } });
      await expect(login(user)).rejects.toThrow(error);
    });

    test('should throw an error if the password is wrong', async () => {
      // Given
      const user = {
        email: 'realworld@me',
        password: '1234',
      };

      const hashedPassword = await bcrypt.hash('4321', 10);

      const mockedResponse = {
        id: 123,
        username: 'Gerome',
        email: 'realworld@me',
        password: hashedPassword,
        bio: null,
        image: null,
        token: '',
        demo: false,
      };

      // When
      prismaMock.user.findUnique.mockResolvedValue(mockedResponse);

      // Then
      const error = String({ errors: { 'email or password': ['is invalid'] } });
      await expect(login(user)).rejects.toThrow(error);
    });
  });

  describe('getCurrentUser', () => {
    test('should return a token', async () => {
      // Given
      const id = 123;

      const mockedResponse = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        password: '1234',
        bio: null,
        image: null,
        token: '',
        demo: false,
      };

      // When
      prismaMock.user.findUnique.mockResolvedValue(mockedResponse);

      // Then
      await expect(getCurrentUser(id)).resolves.toHaveProperty('token');
    });
  });

  describe('updateUser', () => {
    test('should return a token', async () => {
      // Given
      const user = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        password: '1234',
      };

      const mockedResponse = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        password: '1234',
        bio: null,
        image: null,
        token: '',
        demo: false,
      };

      // When
      prismaMock.user.update.mockResolvedValue(mockedResponse);

      // Then
      await expect(updateUser(user, user.id)).resolves.toHaveProperty('token');
    });
  });
});

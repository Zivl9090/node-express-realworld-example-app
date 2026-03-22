import { Request, Response, NextFunction } from 'express';
import validate from '../../app/middleware/validate';
import { registerSchema, loginSchema, updateSchema } from '../../app/middleware/schemas/user.schemas';

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn() as NextFunction;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('validate middleware', () => {
  describe('registerSchema', () => {
    const middleware = validate(registerSchema);

    test('should call next() for valid input', () => {
      const req = {
        body: { user: { email: 'test@example.com', username: 'testuser', password: '1234' } },
      } as Request;
      const res = mockResponse();

      middleware(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should return 422 when email is missing', () => {
      const req = {
        body: { user: { username: 'testuser', password: '1234' } },
      } as Request;
      const res = mockResponse();

      middleware(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        errors: { email: expect.arrayContaining([expect.stringContaining("can't be blank")]) },
      });
    });

    test('should return 422 when username is missing', () => {
      const req = {
        body: { user: { email: 'test@example.com', password: '1234' } },
      } as Request;
      const res = mockResponse();

      middleware(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        errors: { username: expect.arrayContaining([expect.stringContaining("can't be blank")]) },
      });
    });

    test('should return 422 when password is missing', () => {
      const req = {
        body: { user: { email: 'test@example.com', username: 'testuser' } },
      } as Request;
      const res = mockResponse();

      middleware(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        errors: { password: expect.arrayContaining([expect.stringContaining("can't be blank")]) },
      });
    });

    test('should return 422 when email is blank', () => {
      const req = {
        body: { user: { email: '  ', username: 'testuser', password: '1234' } },
      } as Request;
      const res = mockResponse();

      middleware(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        errors: { email: expect.arrayContaining([expect.any(String)]) },
      });
    });

    test('should trim email and username', () => {
      const req = {
        body: { user: { email: ' test@example.com ', username: ' testuser ', password: '1234' } },
      } as Request;
      const res = mockResponse();

      middleware(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(req.body.user.email).toBe('test@example.com');
      expect(req.body.user.username).toBe('testuser');
    });

    test('should strip unknown fields', () => {
      const req = {
        body: { user: { email: 'test@example.com', username: 'testuser', password: '1234', unknown: 'field' } },
      } as Request;
      const res = mockResponse();

      middleware(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(req.body.user.unknown).toBeUndefined();
    });
  });

  describe('loginSchema', () => {
    const middleware = validate(loginSchema);

    test('should call next() for valid input', () => {
      const req = {
        body: { user: { email: 'test@example.com', password: '1234' } },
      } as Request;
      const res = mockResponse();

      middleware(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    test('should return 422 when email is missing', () => {
      const req = {
        body: { user: { password: '1234' } },
      } as Request;
      const res = mockResponse();

      middleware(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        errors: { email: expect.arrayContaining([expect.stringContaining("can't be blank")]) },
      });
    });

    test('should return 422 when password is missing', () => {
      const req = {
        body: { user: { email: 'test@example.com' } },
      } as Request;
      const res = mockResponse();

      middleware(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        errors: { password: expect.arrayContaining([expect.stringContaining("can't be blank")]) },
      });
    });
  });

  describe('updateSchema', () => {
    const middleware = validate(updateSchema);

    test('should call next() for valid partial update', () => {
      const req = {
        body: { user: { bio: 'new bio' } },
      } as Request;
      const res = mockResponse();

      middleware(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    test('should return 422 for invalid email', () => {
      const req = {
        body: { user: { email: 'not-an-email' } },
      } as Request;
      const res = mockResponse();

      middleware(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        errors: { email: expect.arrayContaining([expect.stringContaining('is invalid')]) },
      });
    });

    test('should allow empty body with just user key', () => {
      const req = {
        body: { user: {} },
      } as Request;
      const res = mockResponse();

      middleware(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});

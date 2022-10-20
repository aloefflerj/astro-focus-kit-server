import AuthService from '@src/services/auth';
import { authMiddleware } from '@src/middlewares/auth';
import { StatusCodes } from 'http-status-codes';

describe('Auth Middleware', () => {
  it('should verify a JWT and call the next middleware', () => {
    const jwtToken = AuthService.generateToken({ data: 'fake' });
    const reqFake = {
      headers: {
        'x-access-token': jwtToken,
      },
    };
    const resFake = {};
    const nextFake = jest.fn();
    authMiddleware(reqFake, resFake, nextFake);
    expect(nextFake).toHaveBeenCalled();
  });

  it('should return UNAUTHORIZED if there is a problem on the token verification', () => {
    const reqFake = {
      headers: {
        'x-access-token': 'invalid token',
      },
    };

    const sendMock = jest.fn();
    const resFake = {
      status: jest.fn(() => ({
        send: sendMock,
      })),
    };
    const nextFake = jest.fn();
    authMiddleware(reqFake, resFake as object, nextFake);

    expect(resFake.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(sendMock).toHaveBeenCalledWith({
      code: StatusCodes.UNAUTHORIZED,
      error: 'jwt malformed',
    });
  });

  it('should return UNAUTHORIZED middleware if there is no token', () => {
    const reqFake = {
      headers: {},
    };

    const sendMock = jest.fn();
    const resFake = {
      status: jest.fn(() => ({
        send: sendMock,
      })),
    };
    const nextFake = jest.fn();
    authMiddleware(reqFake, resFake as object, nextFake);

    expect(resFake.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(sendMock).toHaveBeenCalledWith({
      code: StatusCodes.UNAUTHORIZED,
      error: 'jwt must be provided',
    });
  });
});

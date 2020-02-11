import * as bcrypt from 'bcrypt';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import Controller from '../interfaces/controller.interface';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import TokenData from '../interfaces/tokenData.interface';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserDto from '../user/user.dto';
import User from '../user/user.interface';
import userModel from './../user/user.model';
import AuthenticationService from './authentication.service';
import LogInDto from './logIn.dto';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();
  public authenticationService = new AuthenticationService();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
    this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);
    this.router.post(`${this.path}/logout`, this.loggingOut);
  }

  private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const userData: CreateUserDto = request.body;
    try {
      const {
        cookie,
        user,
      } = await this.authenticationService.register(userData);
      response.setHeader('Set-Cookie', [cookie]);
      response.send(user);
    } catch (error) {
      next(error);
    }
  }

  private loggingIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    console.log(`request.body for logginIn: ${JSON.stringify(request.body)}`);
    const logInData: LogInDto = request.body;
    console.log(`logging in ${JSON.stringify(logInData)}`);
    //const user = await this.user.findOne({ email: logInData.email });
    const user = {"_id":"5e1ac6e6ab52d935a34e3589","firstName":"Sean","lastName":"Murphy","status":true,"createdAt":new Date(),"phone":426975587,"email":"sean@test.com","password":"$2b$10$SPzrH9tkU16CoXaIsplDF.6cEURMo8BIpx0vp6v7.npM.31EXPurC","__v":{"$numberInt":"0"}};
    if (user) {
      console.log(`logging in for user: ${JSON.stringify(user)} with data ${JSON.stringify(logInData)}`);
      const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
      if (isPasswordMatching) {
        user.password = undefined;
        const tokenData = this.createToken(user);
        response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
        response.setHeader('Auth', tokenData.token);
        //response.type('application/json');
        //response.setHeader('User', user.email);
        //response.json(user);
        console.log(`authentication controller sendind client user: ${JSON.stringify(user)}`);
        response.send(user);
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  }

  private loggingOut = (request: express.Request, response: express.Response) => {
    response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
    response.send(200);
  }

  private createCookie(tokenData: TokenData) {
    //localStorage.setItem('Authorization', tokenData.token);
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }

  private createToken(user: User): TokenData {
    const expiresIn = 60 * 60; // an hour
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

}

export default AuthenticationController;

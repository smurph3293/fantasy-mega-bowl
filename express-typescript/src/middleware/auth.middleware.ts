import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import userModel from '../user/user.model';
import { IncomingHttpHeaders } from 'http';

async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
  const cookies = request.cookies;
  console.log(`cookies ${JSON.stringify(cookies)} and headers ${JSON.stringify(request.headers)} being evaluated for ${request.url}`);
  //if (cookies && cookies.Authorization) {
  if (request.headers) {
    const headers: IncomingHttpHeaders = request.headers; //JSON.parse(JSON.stringify(request.headers));
    const authToken = headers.authorization;//headers.get('authorization');
    const secret = process.env.JWT_SECRET;
    try {
      //const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
      const verificationResponse = jwt.verify(authToken, secret) as DataStoredInToken;
      const id = verificationResponse._id;
      //const user = await userModel.findById(id);
      const user = {"_id":"5e1ac6e6ab52d935a34e3589","firstName":"Sean","lastName":"Murphy","status":true,"createdAt":new Date(),"phone":426975587,"email":"sean@test.com","password":"$2b$10$SPzrH9tkU16CoXaIsplDF.6cEURMo8BIpx0vp6v7.npM.31EXPurC","__v":{"$numberInt":"0"}};
      if (user) {
        console.log(`user ${user.firstName} authorized for ${request.url}`);
        request.user = user;
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}

export default authMiddleware;

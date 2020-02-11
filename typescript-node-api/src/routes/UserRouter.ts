import {Router, Request, Response, NextFunction} from 'express';
import {plainToClass} from "class-transformer";
import { User } from '../model/User';
import { request } from 'http';
const BetDao =  require('../dao/BetDao');
const UserDao = require('../dao/UserDao');
const MD5 = require('md5');
var mongoose = require('mongoose');

export class UserRouter {
  router: Router

  /**
   * Initialize the HeroRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  public async getUsers(req: Request, res: Response, next: NextFunction) {
    let criteria = {
        _id: req.query.id
      }
      console.log(`crit: ${JSON.stringify(criteria)}`);
    try {
      const user = await UserDao.getUsers(criteria);
      let crit = {
          "users": req.query.id
      }
      console.log(`bet crit: ${JSON.stringify(crit)}`);
      const bets = await BetDao.getBets(crit);
      if (user) {
        console.log(`bets: ${JSON.stringify(bets)}`);
        res.status(200).json(user);
      } else {
        res.status(403).json({message:"Couldn't fetch bets"});
      }
    } catch (e) {
      res.status(404).json({message:"Something went wrong",error:e});
    }
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/', this.getUsers);
  }

}

// Create the HeroRouter, and export its configured Express.Router
const userRoutes = new UserRouter();
userRoutes.init();

export default userRoutes.router;
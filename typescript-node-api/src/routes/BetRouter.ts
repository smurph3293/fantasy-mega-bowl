import {Router, Request, Response, NextFunction} from 'express';
import {plainToClass} from "class-transformer";
import { User } from '../model/User';
const BetDao =  require('../dao/BetDao');
const UserDao = require('../dao/UserDao');
const MD5 = require('md5');
var mongoose = require('mongoose');

export class BetRouter {
  router: Router

  /**
   * Initialize the HeroRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  public async createBet(req: Request, res: Response, next: NextFunction) {
    console.log(`CREATE BET: ${JSON.stringify(req.body)}`);
    let betData = {
      users: req.body.users,
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      status: true
    }
    try {
      const createdBet = await BetDao.createBet(betData);
      if (createdBet) {
        console.log(`createdBet: ${JSON.stringify(createdBet)}`);
        /*for (var userId of createdBet.users) {
          //if (reqUser.id.match(/^[0-9a-fA-F]{24}$/)) {
          //  console.log(`matching`);
          //}
          //let o_id = new mongoose.Types.ObjectId();
          //console.log(`userId: ${JSON.stringify(o_id)}`);
          let criteria = {
            _id: userId
          }
          console.log(`crit: ${JSON.stringify(criteria)}`);
          const user = await UserDao.getUsers(criteria);
          user[0].bets = [createdBet];
          console.log(`updating user: ${JSON.stringify(user[0])}`);
          const updatedUser = await UserDao.updateUser(criteria, {$addToSet: {"bets":user[0].bets}});
          //console.log(`updatedUser: ${updatedUser.catch(e => {console.log(e)})}`)
        }*/
        res.status(200).json({message:'Bet created successfully! Check user'});
      } else {
        res.status(403).json({message:"Couldn't create bet"});
      }
    } catch (e) {
      res.status(404).json({message:"Something went wrong",error:e});
    }
  }

  public async getBets(req: Request, res: Response, next: NextFunction) {
    let criteria = {
      status: true
    }
    try {
      const bets = await BetDao.getBets(criteria);
      if (bets) {
        res.status(200).json(bets);
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
    this.router.post('/', this.createBet);
    this.router.get('/', this.getBets);
  }

}

// Create the HeroRouter, and export its configured Express.Router
const betRoutes = new BetRouter();
betRoutes.init();

export default betRoutes.router;
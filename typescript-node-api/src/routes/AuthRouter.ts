import {Router, Request, Response, NextFunction} from 'express';
import {plainToClass} from "class-transformer";
const UserDao =  require('../dao/UserDao');
const MD5 = require('md5');

export class AuthRouter {
  router: Router

  /**
   * Initialize the HeroRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  public async register(req: Request, res: Response, next: NextFunction) {
    if (!req.body.email || !req.body.password) {
        res.status(401).json({message:'Parameters are missing'})
      } else {
        try {
          let criteria = {
            email: req.body.email
          } 
          const checkEmail = await UserDao.getUsers(criteria);
          if (checkEmail && checkEmail.length==1) {
            res.status(401).json({message:'email already registered'})
          } else {
            let userData = {
              firstName: req.body.firstName ? req.body.firstName : "",
              lastName: req.body.lastName ? req.body.lastName : "",
              email: req.body.email,
              phone: req.body.phone,
              password: MD5(MD5(req.body.password)),
              status: false
            };
            const addUser = await UserDao.createUser(userData);
            // console
            if (addUser) {
              res.status(200).json({message:'User registered successfully! Await commisioners approval for access'})
            } else {
              res.status(403).json({message:"Something went wrong"});
            }
          }
        } catch (error) {
          res.status(404).json({message:"Something went wrong",error:error});
        }
      }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    if (!req.body.email || !req.body.password) {
        res.status(422).json({message:'Parameters are missing'});
      } else {
        try {
          let criteria = {
            email: req.body.email,
            status: true
          };
          const checkEmail = await UserDao.getUsers(criteria);
          if (checkEmail && checkEmail.length>0) {
            let criteria = {
              email: req.body.email,
              password: MD5(MD5(req.body.password))
            };
            const checkPassword = await UserDao.getUsers(criteria);
            if (checkPassword && checkPassword.length==1) {
              res.status(200).json({message:'Logged in successfully!',result:checkPassword[0],token:'dummy-jwt-token-for-now'});
            } else {
              res.status(401).json({message:'Incorrect password'});
            }
          } else {
            res.status(404).json({message:'Email does not exist or Commissioner has not approved you!'});
          }
        } catch (error) {
          res.status(500).json({message:'Something went wrong',error:error});
        }
      }
  }


  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.post('/login', this.login);
    this.router.post('/register', this.register);
  }

}

// Create the HeroRouter, and export its configured Express.Router
const authRoutes = new AuthRouter();
authRoutes.init();

export default authRoutes.router;
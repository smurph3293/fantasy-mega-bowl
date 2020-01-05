import {Router, Request, Response, NextFunction} from 'express';
const rp = require('request-promise');
import {plainToClass} from "class-transformer";
import {YahooToken} from './YahooRouter';
var fs = require('fs');
const YahooFantasy = require('yahoo-fantasy');

var yf = new YahooFantasy(
    'Y!dj0yJmk9NndaSHRib2FSQWFtJmQ9WVdrOVJGVkRhSFJOTldjbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWU4',
    'Y!323696e05be112404a57b63d6cf5248ef6f30ecd'
  );

export class LeagueRouter {
  router: Router

  /**
   * Initialize the HeroRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * GET league meta data.
   */
  public getLeagueMeta(req: Request, res: Response, next: NextFunction) {
    var yToken: YahooToken;
    fs.readFile('yahoo_token.json', 'utf8', function readFileCallback(err, data) {
        if (err){
            console.log(err);
        } else {
        yToken = plainToClass(YahooToken, JSON.parse(data)); //now it a YahooToken
        yf.setUserToken(`${yToken.access_token}`);
        yf.user.game_leagues(
            'nba',
            function(err, data) {
              if (err) {
                  res.send(err);
              } else {
                  res.send(data);
              }
            }
          );
        /*//console.log(`using access token : ${yToken.access_token}`);
        var options = {
            method: 'GET',
            uri: 'https://api.login.yahoo.com/openid/v1/userinfo',
            headers: {
                'Authorization': `Bearer ${yToken.access_token}`
                },
            json: true // Automatically stringifies the body to JSON
        };
        rp(options)
            .then(function (parsedBody) {
                // POST succeeded...
                console.log(`Got user info: ${JSON.stringify(parsedBody)}`);
            })
            .catch(function (err) {
                // POST failed...
                res.send(err);
            });*/
        }
    });
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/meta', this.getLeagueMeta);
  }

}

// Create the HeroRouter, and export its configured Express.Router
const leagueRoutes = new LeagueRouter();
leagueRoutes.init();

export default leagueRoutes.router;
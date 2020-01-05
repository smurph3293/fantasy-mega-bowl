import {Router, Request, Response, NextFunction} from 'express';
const rp = require('request-promise');
import {plainToClass} from "class-transformer";
var fs = require('fs');

export class YahooToken {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    xoauth_yahoo_guid: string;
    id_token: string;
}

export class YahooRouter {
  router: Router

  /**
   * Initialize the HeroRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * GET auth.
   */
  public requestAuth(req: Request, res: Response, next: NextFunction) {
    var options = {
        method: 'GET',
        uri: 'https://api.login.yahoo.com/oauth2/request_auth',
        qs: {
            client_id: 'dj0yJmk9NHRjUEpkVkJJSGVJJmQ9WVdrOVpVY3pRMGRSTkdNbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWIz',
            redirect_uri: 'https://trashtownmegabowl/api/v1/yahoo/get_token',//'http://localhost:3000/api/v1/yahoo/get_token',
            response_type: 'code',
            scope: 'openid',
            nonce: 'seanuniquestring'
        },
        //json: true // Automatically stringifies the body to JSON
    };

    res.redirect(options.uri+
            '?client_id='+options.qs.client_id+
            '&redirect_uri='+options.qs.redirect_uri+
            '&response_type='+options.qs.response_type+
            '&scope='+options.qs.scope+
            '&nonce='+options.qs.nonce);
  }

  /**
   * GET access_token.
   */
  public getToken(req: Request, res: Response, next: NextFunction) {
    var options = {
        method: 'POST',
        uri: 'https://api.login.yahoo.com/oauth2/get_token',
        /*headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            },*/
        form: {
            code: 'uqc9jdu',
            grant_type: 'authorization_code',
            client_id: 'dj0yJmk9NHRjUEpkVkJJSGVJJmQ9WVdrOVpVY3pRMGRSTkdNbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWIz',
            client_secret: '6319b6678fb9ee9a39f8f6e95bd0cc0a91f6ac78',
            redirect_uri: 'https://trashtownmegabowl/api/v1/yahoo/get_token'
        },
        json: true
    }
    rp(options)
        .then(function (parsedBody) {
            // POST succeeded...
            const realYahooToken = plainToClass(YahooToken, parsedBody);
            fs.writeFile("yahoo_token.json", JSON.stringify(parsedBody), 'utf8', function(err) {
                if (err) {
                    console.log(err);
                }
            });
            res.send(`Successfully retrieved yahoo access token`);
        })
        .catch(function (err) {
            // POST failed...
            res.send(err);
        });
  }

    /**
   * GET access_token.
   */
  public refreshToken(req: Request, res: Response, next: NextFunction) {
    fs.readFile('yahoo_token.json', 'utf8', function readFileCallback(err, data) {
        if (err){
            console.log(err);
        } else {
        const yToken = plainToClass(YahooToken, JSON.parse(data)); //now it a YahooToken
        console.log(`using refresh_token : ${yToken.refresh_token}`);
        var options = {
            method: 'POST',
            uri: 'https://api.login.yahoo.com/oauth2/get_token',
            headers: {
                'Authorization': 'Basic ZGoweUptazlObmRhU0hSaWIyRlNRV0Z0Sm1ROVdWZHJPVkpHVmtSaFNGSk9UbGRqYldOSGJ6bE5RUzB0Sm5NOVkyOXVjM1Z0WlhKelpXTnlaWFFtYzNZOU1DWjRQV1U0OjMyMzY5NmUwNWJlMTEyNDA0YTU3YjYzZDZjZjUyNDhlZjZmMzBlY2Q=',
                'Content-Type': 'application/x-www-form-urlencoded'
                },
            form: {
                refresh_token: `${yToken.refresh_token}`,
                grant_type: 'refresh_token',
                redirect_uri: 'https://trashtownmegabowl/api/v1/yahoo/get_token'
            },
            json: true
        }
        rp(options)
            .then(function (parsedBody) {
                // POST succeeded...
                const realYahooToken = plainToClass(YahooToken, parsedBody);
                fs.writeFile("yahoo_token.json", JSON.stringify(parsedBody), 'utf8', function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
                res.send(`Successfully retrieved yahoo access token`);
            })
            .catch(function (err) {
                // POST failed...
                res.send(err);
            });
        }});
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/request_auth', this.requestAuth);
    this.router.get('/get_token', this.getToken);
    this.router.get('/refresh_token', this.refreshToken);
  }

}

// Create the HeroRouter, and export its configured Express.Router
const yahooRoutes = new YahooRouter();
yahooRoutes.init();

export default yahooRoutes.router;
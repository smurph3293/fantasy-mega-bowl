const express = require('express');
const app = express();
const YahooFantasy = require('yahoo-fantasy');

var yf = new YahooFantasy(
  'Y!dj0yJmk9NndaSHRib2FSQWFtJmQ9WVdrOVJGVkRhSFJOTldjbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWU4',
  'Y!323696e05be112404a57b63d6cf5248ef6f30ecd'
);
 
yf.setUserToken(
  'Y!1mg8Y4yYuwOyUxJTWIRM1o.v9T0gKno8NLfFW3q9fatLXqLE0I59z6uKIJbgziMS7aQP6a_05F6Q5fwF5DPS6IabXACR4qb8E56eg_e.a_olKsE6M5jLs25gZePI7tDpk1wjGDMRvzEOfabussCluLt6fsduXPFAkv5c6QCAwHFqJ0gypWgSSwkIjbS9t0S5.IIf07mOLtXL8qPkM7DmSADJanuyYn1_duBNnZW_u2irCYMPswM4thLYY181DhJ_7r26dCtv5N71lsD8XhCPB1Zkm.uuLUOOnk5LgZddCcWef_knTxqckdBPhIqxd7EDXdWpo8szNnC9_o3Yz_ZnzMvAZP7e1upSP2O8fuj6Rni6IqWR57aN3Jn33zbKl_1SHv4WeC9lUD2_2nG1autN9WMA2WLFu6v7PcCEmr5SmcSQSZj2aa4NNwxx4FqxK495qsptA_ULsvP7OxK3XAVLeCxukATuR3YyaFR1ZP4iPnz3O7hYD7PJ5Q56KWDp2ap1nX36pXIs6dATqgQ28n0JqW1p95p_Vn3Icc7Xy.v44bevHbm37SZfDi7_DTl9dS88Y4WhzDfyQJFvzz2TR4c5sTMKwOeFpjNvv1TyjmzuM2rTRhdY4x1CtNAard0czr86rMAXiTp5uEbI0fE4oXC0DYP8LwwBwzGCXV8Ne.uSYzm6qriQqDAgtHw0hJwW2Rfuy.hK0zr0EQE9_OIp5DolNSVxdbup1HwntuPf2cOFwC0Q_EBSInEEG.COnoxY.U1a4CLFoh_szIeyjXH6TZuAOFo.7yETKr1BE09DEhFF84Pp8HOwGprdgww._udrAA.g9SjaGKcsPDeNn90kzAa18AnWoMi5Id9CUO7DUS9hd6BtCivuF9G9lKDGC_dBPR0DZUJAQCim78Xn.kUf8CwmBPc2OS9K2ImfslMcTvM6hC3hQFdNokNhpDdv2g3rRbKYZ2gedxhej4sXCtjkKhXqG.BTbG2dxzllhMXZHT9ZyXaB85QaoE387LJusKbmNO9eNCblmuCha5zQEW4NkaQ7s.LKm1Q3tQhbSw5Qlas6TrNjhb67X_MFpiw1gefwebY-'
);
  

app.get('/', (req, res) => {  
    yf.game.leagues(
        '390',
        '390.l.35018', 
        function(err, data) {
          if (err) {
              console.log(`error: ${JSON.stringify(err)}`);
          } else {
              console.log(`succs? here is data: ${JSON.stringify(data)}`);
          }
        }
      );
    res.send('Hello world from a Node.js app!')
});

app.listen(3000, () => {    
    console.log('Server is up on 3000')
});
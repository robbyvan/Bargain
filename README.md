# Recent project: Bargain

##Description
+ O2O Front-End Back-End separation app. 
+ Using Restful API, Angular + Express + MongoDB. 
+ Practising MEAN Stack development.


##Update
+ Feb 3rd 
 - Init 
+ Feb 4th
 - Register API finished. /api/register
 - Login API Added. /api/login 
   <br />(middlewares: express-session, passport(local Strategy), cookie-parser)
   <br />Need to add http interceptor to intercept 400/401 to render using Angular later
 - Authentication added. /api/ensureAuth
   <br /> If user is not logged in, when visiting pages that need authority, user will be redirected to login page.
+ Feb 7th
 - Added Service to share data between controllers
 - Item methods added.
+ Feb 11th
 - Cart function added.

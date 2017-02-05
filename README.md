# Recent project: Bargain

##Description
+ O2O Front-End Back-End separation app. 
+ Using Restful API, Angular + Express + MongoDB. 
+ Practising Full-Stack development.


##Update
+ Feb 3rd 
 - Init 
+ Feb 4th
 - Register API finished. /api/register
 - Login API Added. /api/login 
   <br />(middlewares: express-session, passport(local Strategy), cookie-parser)
   <br />Need to add http interceptor intercept 401 using Angular later
 - Authentication added. /api/ensureAuth
   <br /> If user is not logged in, when visiting some pages, he/she will be redirect to login page.

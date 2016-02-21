# allsop-admin

A backend portal for updating a couch database and sending push notifications.  
  
Heroku url:  
https://allsop-admin-portal.herokuapp.com/

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)  
version 0.15.1.  

## Build & development
Run `grunt -f` for building and `grunt serve` for preview.  

## Testing
Running `grunt test` will run the unit tests with karma.  

## References
- http://pouchdb.com/guides/setup-couchdb.html
- http://pouchdb.com/getting-started.html
- http://yeoman.io/codelab/index.html

## Porting over to a new server
When moving this project to your own couch servers you need do two things.  
Open the website, open all the tabs, making sure that all the remote data syncs locally.  
Next in the couch change the remote pouch databases to your own.  
Now when you run the server and open the various tabs, the local databases will sync with your own remote databases.  
  
**Databases:**  
- allsop-auctions  
- allsop-details  
- allsop-messages  
- allsop-users  

  
These databases are located in the angular services.  

## Add User Route
`/adduser`

This route is for the ionic application.
It is a post route.

It expects the following data:
`
{"deviceToken": "12345", "deviceType": "ios"}
`
*A timestamp is then added and the user is saved to the remote pouch database which the admin backend and mobile app can view.*  
*This is then used by the push notification service.*

And returns either:
`user added`
OR
`user already in database`

*The ionic mobile application sends a post request to this route whenever it saves its data to Ionic.io*
*This allows us to remove dependence from Ionic.io*

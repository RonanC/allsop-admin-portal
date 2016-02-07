# allsop-admin

A backend portal for updating a couch database and sending push notifications.  
  
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
- allsop-app  
- allsop-backend  
- allsop-auctions  
  
These databases are located in the angular services.  
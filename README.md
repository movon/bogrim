The website of "Yedidey Hakfar Hayarok" organization.
We built it volunteeraly for our high school.
The server and the database run on AWS, same as the email service which we use SES + lambda for capturing and sending emails. therefore emails are almost totally free instead of using a paid email service such as gmail for organizations.

If you want to run it locally, make sure you run app.js and not bin/www, configure webstorm that way, give it the app.js as the javascript file.

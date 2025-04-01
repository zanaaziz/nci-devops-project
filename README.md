# NCI DevOpsSec project (Power HR)

This is a Node.js Express application with PostgreSQL CRUD functionality hosted on an AWS EC2 instance with CI/CD via GitHub Actions.

To run the app locally, the following is required:

-   Prerequisites:
    -   Node.js v20
    -   PostgreSQL
-   Then:
    -   Run "npm install" in the root directory.
    -   Create a fresh local PostgreSQL database on your machine for the app to connect to.
    -   Create an ".env" file in the root directory, copy the contents of the ".env.example" file into your ".env" and update the database credentials to your own.
    -   Run "npm start".
    -   You should see a console log saying "HTTP Server running on port ..." followed by another log about database seeding which the app does automatically upon its first run.
    -   Open the app in your browser and you can either register a new user or else login as an admin with:
        -   Email: "admin@email.com"
        -   Password: "admin"

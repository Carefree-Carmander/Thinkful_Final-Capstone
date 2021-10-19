# Thinkful Capstone: Periodic Tables

Live app is available here:  <u>https://sleepy-shelf-72910.herokuapp.com/dashboard</u>

### A full-stack app built using:

- HTML
- CSS
- JavaScript
- React
- Express
- Knex
- PostgreSQL API

------

## Available API Endpoints

|                    URL                     | Method |                      Description                      |
| :----------------------------------------: | :----: | :---------------------------------------------------: |
|      `/reservations?date=YYYY-MM-DD`       |  GET   |     Lists all reservations for the date specified     |
| `/reservations?mobile_number=999-999-9999` |  GET   | Lists all reservations for the phone number specified |
|              `/reservations`               |  POST  |               Creates a new reservation               |
|       `/reservations/:reservationId`       |  GET   |         Reads a reservation by reservation_id         |
|       `/reservations/:reservationId`       |  PUT   |        Updates a reservation by reservation_id        |
|                 `/tables`                  |  GET   | Updates the status of a reservation by reservation_id |
|                 `/tables`                  |  GET   |                   Lists all tables                    |
|          `/tables/:table_id/seat`          |  POST  |                  Creates a new table                  |
|         `/tables/:tables_id/seat`          |  PUT   |            Seats a reservation at a table             |
|          `/tables/:table_id/seat`          | DELETE |              Finishes an occupied table               |

------

## App Functionality

**Dashboard**

- Defaults to displaying a list of booked (or seated) reservations for the current date.
- Navigation buttons: Previous Day, Today, & Next Day are available for changing the date displayed by the dashboard.
- All tables (free or occupied) are also displayed here.

![image-20211018191438898](C:\Users\OSoSillyMe\AppData\Roaming\Typora\typora-user-images\image-20211018191438898.png)

------

**Menu**

The menu provides options to:

- Search for a reservation

  ![image-20211018183933527](C:\Users\OSoSillyMe\AppData\Roaming\Typora\typora-user-images\image-20211018183933527.png)

- Create a new reservation

  ![image-20211018183948304](C:\Users\OSoSillyMe\AppData\Roaming\Typora\typora-user-images\image-20211018183948304.png)

- Create a new table

  ![image-20211018183958365](C:\Users\OSoSillyMe\AppData\Roaming\Typora\typora-user-images\image-20211018183958365.png)

------

**Search**

- Enter the phone number for the reservation.

- Click `Find`.

  ![image-20211018184233980](C:\Users\OSoSillyMe\AppData\Roaming\Typora\typora-user-images\image-20211018184233980.png)

Any matching results will appear.

------

**New Reservation**

- Fill out the form with reservation information.

- Click `Submit`.

  ![image-20211018184352500](C:\Users\OSoSillyMe\AppData\Roaming\Typora\typora-user-images\image-20211018184352500.png)

------

**Seating a Reservation**

- Click `Seat` on the reservation you'd like to seat.

- Select a table from the select menu.

- Click `Submit` to seat the reservation at the selected table.

  ![image-20211018184502839](C:\Users\OSoSillyMe\AppData\Roaming\Typora\typora-user-images\image-20211018184502839.png)

Once a reservation is seated, the reservation status will change from `booked` to `seated`.

![image-20211018184628943](C:\Users\OSoSillyMe\AppData\Roaming\Typora\typora-user-images\image-20211018184628943.png)

------

**Finishing a Reservation**

- Click `Finish`on the table that is finished.

- Click `OK` on the confirmation window that shows up.

  ![image-20211018185818015](C:\Users\OSoSillyMe\AppData\Roaming\Typora\typora-user-images\image-20211018185818015.png)

Note: finished reservations are no longer visible on the dashboard.

------

**Editing a Reservation**

- Click `Edit` on the reservation you want to edit.

- Edit any of the information as needed.

- Click `Submit` to save updated reservation information.

  ![image-20211018190242605](C:\Users\OSoSillyMe\AppData\Roaming\Typora\typora-user-images\image-20211018190242605.png)

------

**Cancelling Reservations**

- Click `Cancel` on the reservation you'd like to cancel.

- Click `OK` on the confirmation window that pops up.

  ![image-20211018190432689](C:\Users\OSoSillyMe\AppData\Roaming\Typora\typora-user-images\image-20211018190432689.png)

Note: cancelled reservations are no longer visible on the dashboard.

------

## Installation

1. Fork and clone this repository.
2. Run `cp ./back-end/.env.sample ./back-end/.env`.
3. Update the `./back-end/.env` file with the connection URL's to your database instance.
4. Run `cp ./front-end/.env.sample ./front-end/.env`.
5. Include your backend connection within `./front-end/.env` (defaults to `http://localhost:5000`).
6. Run `npm install` to install project dependencies.
7. Run `npm run start` to start the server.

If you have trouble getting the server to run, reach out for assistance.

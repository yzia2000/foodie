CREATE EXTENSION pg_trgm;
BEGIN;
CREATE TABLE Restaurants(
  id SERIAL PRIMARY KEY,
  name varchar(255) NOT NULL,
  cash_balance float NOT NULL
);

CREATE TABLE Opening_Hours(
  restaurant_id int references Restaurants(id),
  weekday int check(weekday <= 6 and weekday >= 0),
  start_time time NOT NULL,
  end_time time NOT NULL,
  PRIMARY KEY(restaurant_id, weekday)
);

CREATE TABLE Items(
  id SERIAL PRIMARY KEY,
  restaurant_id int references Restaurants(id) NOT NULL,
  name varchar(255) NOT NULL,
  price float NOT NULL,
  unique(restaurant_id, name)
);

CREATE TABLE Users(
  id SERIAL PRIMARY KEY,
  cash_balance float NOT NULL,
  name varchar(255)
);

CREATE TABLE Transactions(
  id SERIAL PRIMARY KEY,
  item_id int references Items(id) NOT NULL,
  user_id int references Users(id) NOT NULL,
  date timestamp NOT NULL,
  unique(item_id, user_id, date)
);

COMMIT;

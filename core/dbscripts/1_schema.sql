BEGIN;
CREATE TABLE Restaurants(
  id SERIAL PRIMARY KEY,
  name varchar(255) NOT NULL,
  cash_balance int NOT NULL
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
  price int NOT NULL,
  unique(restaurant_id, name)
);
COMMIT;

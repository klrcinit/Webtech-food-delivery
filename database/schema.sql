create table public.users
(
  id              serial
    primary key,
  email           varchar(255)
    constraint unique_email
      unique,
  location_x      integer,
  location_y      integer,
  password        text,
  role            text    default 'customer'::text,
  address         text,
  failed_attempts integer default 0,
  lock_until      timestamp
);



create table public.restaurants
(
  id         serial
    primary key,
  name       varchar(255),
  cuisine    varchar(255),
  rating     numeric,
  location_x integer,
  location_y integer
);



create table public.dishes
(
  id            serial
    primary key,
  restaurant_id integer
    references public.restaurants,
  name          varchar(255),
  price         numeric,
  rating        double precision default 0
);



create table public.orders
(
  id                         serial
    primary key,
  user_id                    integer
    references public.users,
  restaurant_id              integer
    references public.restaurants,
  total_price                numeric,
  status                     varchar(50),
  estimated_delivery_minutes integer,
  created_at                 timestamp with time zone default now(),
  estimated_delivery_time    integer
);



create table public.order_items
(
  id       serial
    primary key,
  order_id integer
    references public.orders,
  dish_id  integer
    references public.dishes,
  quantity integer
);


create table public.reviews
(
  id            serial
    primary key,
  user_id       integer
    references public.users,
  restaurant_id integer
    references public.restaurants,
  rating        integer,
  comment       text,
  created_at    timestamp default now(),
  dish_id       integer
);




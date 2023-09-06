import { serial, text, timestamp, mysqlTable, datetime, varchar, int, float, boolean, smallint, mysqlEnum } from "drizzle-orm/mysql-core";
 
export const users = mysqlTable("users", {
  id: serial("id"),
  firstname: varchar("firstname", {length: 255}).notNull(),
  lastname: varchar("lastname", {length: 255}).notNull(),
  email: varchar("email", {length: 255}).notNull(),
  birthday: datetime("birthday").notNull(),
  gender: varchar("gender", {length: 255}).notNull(),
  phone: varchar("phone", {length: 255}),
  address: varchar("address", {length: 255}),
  country: varchar("country", {length: 255}),
  zip: varchar("zip", {length: 255}),
  city: varchar("city", {length: 255}),
  state: varchar("state", {length: 255}),
  emergencyname: varchar("emergencyname", {length: 255}),
  emergencyphone: varchar("emergencyphone", {length: 255}),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const races = mysqlTable("races", {
  id: serial("id"),
  name: varchar("name", {length: 255}).notNull(),
  routeURL: varchar("routeurl", {length: 2048}),
  heroURL: varchar("herourl", {length: 2048}),
  location: varchar("location", {length: 2048}),
  length: smallint("length").notNull(),
  starttime: datetime("starttime").notNull(),
  endtime: datetime("endtime").notNull(),
  description: text("description").notNull(),
  contactemail: varchar("contactemail", {length: 255}),
  instagram: varchar("instagram", {length: 255}),
  facebook: varchar("facebook", {length: 255}),
  twitter: varchar("twitter", {length: 255}),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const signups = mysqlTable("signups", {
  id: serial("id"),
  userid: int('userid').notNull(),
  raceid: int('raceid').notNull(),
  eventid: int('eventid').notNull(),
  bibnumber: int('bibnumber'),
  paystatus: mysqlEnum('paystatus', ['paid','pending','unpaid']).notNull(),
  totaltime: float('totaltime'),
  completed: boolean('completed'),
  signupdate: timestamp('signupdate')
});

export const events = mysqlTable("events", {
  id: serial("id"),
  raceid: int("raceid").notNull(),
  name: varchar("name", {length: 255}).notNull(),
  price: int("price").notNull()
});

export const admins = mysqlTable("admins", {
  id: serial("id"),
  email: varchar("email", {length: 255}).notNull()
});

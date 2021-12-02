# ODD (On Demand Delivery)

ODD is an on-demand delivery app, where users can make request to deliver their packages from one location to another within India(for now some of the selected cities)

Most of the time what happens is, If someone wants to deliver a package to another location, they have to search nearby “Truck wala or Rrickshaw wala" with no fixed prices.
ODD tries to solve the problems by providing a platform where users can find and book the vehicle that suits their needs, and deliver packages to the destination without any extra effort and within fair price.

## Roles

- USER - A person who wants to send the package
- DRIVER - A person who is responsible for delivering a package
- ADMIN - A person who can see statistics of services and details of Users, Drivers and Orders.

## System Architecture

This application is made on microservices architecture. A microservices architecture consists of a collection of small, autonomous services. Each service is self-contained and should implement a single business capability within a bounded context. A bounded context is a natural division within a business and provides an explicit boundary within which a domain model exists.

## Tech Stack

**Client:** React, Redux, TailwindCSS

**Server:** Node, Express, Socket

**Database:** Mongodb, S3 bucket

**Event Queue:** Rabbitmq

**Proxy Server:** Ngix

## Run Locally

Clone the project

```bash
    git clone --recursive https://github.com/pesto-students/odd-backend-n10-epsilon.git
```

Go to the project directory

```bash
  cd odd-backend-n10-epsilon
```

Build docker image

```bash
  docker-compose build
```

Start the server

```bash
  docker-compose up
```

## Service listing on

User Service

```bash
    http://localhost
```

Driver Service

```bash
  http://localhots/driver/
```

Order Service

```bash
  http://localhots/order/
```

Admin Service

```bash
  http://localhots/admin/
```

Socket Connection

```bash
  http://localhots/socket/mysocket/
```

## Folder structure

- User - User service
- Driver - Driver service
- Admin - Admin service
- Order - Order service
- Socket - Socket service
- Proxy - Ngix proxy server
- Package - Contains common file as npm package

## Custom Package

To instal @odd_common/common

RUN `npm install @odd_common/common` for ways to get started.

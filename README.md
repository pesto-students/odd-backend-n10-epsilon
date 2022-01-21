![ODD Logo](https://user-images.githubusercontent.com/47411494/150539976-aeeb2133-e52f-45e1-9a42-2b1b4e043803.png)

# ODD (On Demand Delivery)

ODD is an on-demand delivery app, where users can make request to deliver their packages from one location to another within India(for now some of the selected cities)

Most of the time what happens is, If someone wants to deliver a package to another location, they have to search nearby “Truck wala or Rrickshaw wala" with no fixed prices. ODD tries to solve the problems by providing a platform where users can find and book the vehicle that suits their needs, and deliver packages to the destination without any extra effort and within fair price.

## Roles

- USER - A person who wants to send the package
- DRIVER - A person who is responsible for delivering a package
- ADMIN - A person who can see statistics of services and details of Users, Drivers and Orders.

# Table of Contents

1. [Demo](#demo)
2. [Installation](#installation)
3. [System Architecture](#system-architecture)
4. [Technology Stack](#technology-stack)
5. [Custom Package](#custom-package)
6. [Authors](#authors)
7. [License](#license)

# Demo

- [Driver App](http://driver-app-odd.s3-website.ap-south-1.amazonaws.com/)
- [User App](http://user-app-odd.s3-website.ap-south-1.amazonaws.com/)
- [Admin App](http://admin-app-odd.s3-website.ap-south-1.amazonaws.com/)

Test Credentials:

- For Driver
  - Phone: 9999999999
  - OTP: 0000
- For User
  - Phone: 8888888888
  - OTP: 0000
- For Admin
  - Email: admin@mailinator.com
  - Password: 12345678

# Installation

Clone the project

```bash
    git clone --recursive https://github.com/pesto-students/odd-backend-n10-epsilon.git
```

Go to the project directory

```bash
  cd odd-backend-n10-epsilon
```

## Run Locally

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

# System Architecture

This application is made on microservices architecture. A microservices architecture consists of a collection of small, autonomous services. Each service is self-contained and should implement a single business capability within a bounded context. A bounded context is a natural division within a business and provides an explicit boundary within which a domain model exists.

# Technology Stack

We tried to use a completely modern tech stack while testing out some new technologies that we had never used before. This resulted in a fast, performant, and easily-extensible web app that should be fairly future-proof for the coming next several years. We used:

- **Server:** [Node](https://nodejs.org/), [Express](https://expressjs.com/), [SocketIO](https://socket.io/)
- **Database:** [Mongodb](https://www.mongodb.com/), [Mongodb](https://aws.amazon.com/s3/)
- **Event Queue:** [RabbitMQ](https://www.rabbitmq.com/)
- **Proxy Server:** [Ngix](https://www.nginx.com/)

# Custom Package

To instal @odd_common/common

RUN `npm install @odd_common/common` for ways to get started.

```bash
    git clone https://github.com/pesto-students/odd_packages.git
```

# Authors

- [Dharmendra Jagodana](https://github.com/JagodanaDharmendra)
- [Akash Malviya](https://github.com/Akashmalviya)

# License

[MIT](https://opensource.org/licenses/MIT)

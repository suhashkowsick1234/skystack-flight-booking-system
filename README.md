✈️ SkyStack – Flight Booking System

SkyStack is a scalable backend-focused flight booking system built with Node.js, MongoDB, and Redis.
The project is designed to simulate real-world airline booking workflows and demonstrates clean service-layer architecture, authentication, caching, containerization, and cloud-ready deployment.

![Architecture Diagram](https://github.com/LiteLife99/Nodejs-Mongo-POC/assets/52050647/2896ade7-6fa1-45dd-a794-682baf560f4a)

---

## ✨ Features

- 🔐 **JWT-based Authentication** - Secure token-based user authentication
- 🛫 **Flight Management** - Create and manage flight schedules
- 💺 **Seat Booking** - Real-time seat availability and booking system
- ⚡ **Redis Caching** - High-performance caching layer for improved response times
- 🐳 **Docker Support** - Containerized deployment ready
- ☁️ **AWS Integration** - ECS, S3, Kinesis Firehose, and Kibana integration
- 🧪 **Unit Testing** - Comprehensive test coverage with Jest
- 📊 **Health Monitoring** - Health check endpoints for container orchestration
- 📝 **Structured Logging** - Centralized logging with AWS Kinesis Firehose

---

## 🧰 Tech Stack

- **Runtime**: Node.js (v14+)
- **Database**: MongoDB - Primary data store
- **Cache**: Redis - Caching layer for performance optimization
- **Authentication**: JWT (JSON Web Tokens)
- **Framework**: Express.js
- **Testing**: Jest + Supertest
- **Containerization**: Docker
- **Cloud Services**: 
  - Amazon ECS - Container orchestration
  - AWS S3 - File storage
  - AWS Kinesis Firehose - Log streaming
  - Kibana - Log visualization

---

## 🚀 Quick Start

### Prerequisites

- Node.js 14+ (recommended: Node.js 16)
- MongoDB instance (local or remote)
- Redis instance (local or remote)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/suhashkowsick1234/skystack-flight-booking-system.git
   cd skystack-flight-booking-system

   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   Update `config/config.json` with your MongoDB and Redis connection details:
   ```json
   {
     "test": {
       "mongodb": {
         "MONGO_URI": "mongodb://localhost:27017/SkyStack"
       },
       "redis": {
         "host": "localhost",
         "port": 6379
       }
     }
   }
   ```

   > ⚠️ **Security Note**: In production, use environment variables or AWS Secrets Manager instead of hardcoded config files.

4. **Start MongoDB and Redis**

   Ensure MongoDB and Redis are running on your system:
   ```bash
   # MongoDB
   mongod

   # Redis
   redis-server
   ```

5. **Run the application**

   ```bash
   # Production mode
   npm start

   # Development mode with auto-reload
   npm run dev

   # Custom port
   PORT=5000 npm start
   ```

   The server will start on `http://localhost:8081` (default port).

6. **Run tests**

   ```bash
   npm run test
   ```

---

## 🧩 Architecture Overview

### Service Layer Architecture

The application follows a service-oriented architecture with clear separation of concerns:

- **`loginService`** - Handles user authentication and JWT token generation
- **`flightService`** - Manages flight creation, scheduling, and flight data operations
- **`seatService`** - Handles seat availability checks and booking operations

### Supporting Infrastructure

- **Redis Cache** - Caches frequently accessed MongoDB queries for improved performance
- **Middleware** - Authentication and logging middleware for request processing
- **Routers** - RESTful API endpoints organized by domain
- **Models** - MongoDB Mongoose schemas for data persistence

### Deployment Architecture

- **Docker** - Containerized application for consistent deployments
- **Amazon ECS** - Container orchestration and scaling
- **Load Balancer** - Request distribution across multiple instances
- **Kibana** - Centralized log aggregation and monitoring

---

## 📡 API Endpoints

### Authentication
- `POST /auth/login` - User login and token generation

### Flights
- `POST /flight/schedule` - Create a new flight schedule
- `GET /flight/:id` - Get flight details

### Seats
- `GET /seat/:flightId` - Get available seats for a flight
- `POST /seat/book` - Book a seat

### Health Check
- `GET /healthCheck` - Application health status

---

## 🗃️ Data Models

### Users

| Field     | Type     | Description          |
|-----------|----------|----------------------|
| _id       | ObjectId | Unique user ID       |
| name      | String   | User's full name     |
| email     | String   | Unique email address |
| password  | String   | Encrypted password   |

### Flights

| Field            | Type     | Description                    |
|------------------|----------|--------------------------------|
| _id              | ObjectId | Unique flight ID               |
| airlines         | String   | Airline name                   |
| numOfSeats       | Number   | Total number of seats          |
| numOfBookedSeats | Number   | Number of booked seats         |

### Seats

| Field          | Type     | Description                    |
|----------------|----------|--------------------------------|
| _id            | ObjectId | Unique seat ID                 |
| seatNumber     | Number   | Seat number                    |
| available      | Boolean  | Seat availability status       |
| flightId       | ObjectId | Reference to parent flight     |
| passengerId    | String   | ID of passenger (if booked)    |
| passengerName  | String   | Passenger name (if booked)     |
| passengerAge   | Number   | Passenger age (if booked)      |
| passengerPhone | Number   | Passenger phone (if booked)    |

---

## 📂 Project Structure

```
SkyStack/
├── __tests__/              # Unit tests
│   ├── flights.test.js
│   ├── seats.test.js
│   └── users.test.js
├── config/                 # Configuration files
│   └── config.json
├── middleware/             # Express middleware
│   ├── authMiddleware.js
│   └── loggerMiddleware.js
├── mongodbModels/          # MongoDB schemas
│   ├── connection.js
│   ├── Flight.js
│   ├── Seat.js
│   └── Users.js
├── router/                 # API routes
│   ├── flightRouter.js
│   ├── loginRouter.js
│   └── seatRouter.js
├── services/               # Business logic
│   ├── flightService.js
│   ├── loginService.js
│   └── seatService.js
├── utils/                  # Utility functions
│   ├── fetchDummyToken.js
│   ├── firehoseUtil.js
│   └── redisUtil.js
├── app.js                  # Express app configuration
├── server.js               # Server entry point
├── Dockerfile              # Docker configuration
├── package.json
└── README.md
```

---

## 🔐 Authentication Flow

1. User sends credentials to `/auth/login`
2. Server validates credentials and generates a JWT token
3. Client stores the token and includes it in subsequent requests
4. Protected routes validate the token using `Authorization: Bearer <token>` header

---

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t skystack-flight-booking .
```

### Run Container

```bash
docker run -p 8081:8081 skystack-flight-booking
```

### Docker Compose (Future Enhancement)

A `docker-compose.yml` file can be added to orchestrate MongoDB, Redis, and the application together.

---

## 📈 Monitoring & Logging

- **Health Checks**: `/healthCheck` endpoint for container health monitoring
- **Structured Logging**: All logs are streamed to AWS Kinesis Firehose
- **Log Visualization**: Kibana dashboards for log analysis
- **Request Logging**: Middleware logs all incoming requests and responses

---

## 🧪 Testing

Run the test suite:

```bash
npm run test
```

Tests include:
- User authentication tests
- Flight management tests
- Seat booking tests
- Coverage reports

---

## 🔒 Security Considerations

- Passwords are hashed using `bcryptjs`
- JWT tokens for stateless authentication
- CORS configured for cross-origin requests
- Environment-based configuration separation
- **Important**: Never commit production secrets to the repository

---

## 🚀 Future Enhancements

- [ ] Kafka event bus for inter-service communication
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Swagger/OpenAPI documentation
- [ ] Docker Compose with production-grade configs
- [ ] Rate limiting middleware
- [ ] GraphQL API support
- [ ] WebSocket support for real-time updates
- [ ] Integration tests
- [ ] Performance benchmarking

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👤 Author

**Suhash Kowsick**  
Software Development Engineer  

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Express.js community
- MongoDB and Redis documentation
- AWS cloud services

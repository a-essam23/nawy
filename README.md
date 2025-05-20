# Nawy Apartments Listing App

This full-stack application allows users to browse, search, view details of, and add apartment listings. 

## Tech Stack

![Tech Stack](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Tech Stack](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Database](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)


## Table of Contents

- [Nawy Apartments Listing App](#nawy-apartments-listing-app)
  - [Tech Stack](#tech-stack)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
    - [Core Features](#core-features)
    - [Bonus Features](#bonus-features)
  - [Possible improvmenets](#possible-improvmenets)
  - [Tech Stack](#tech-stack-1)
    - [Backend](#backend)
    - [Frontend](#frontend)
    - [Database](#database)
    - [Documentation:](#documentation)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
    - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Environment Variables](#2-environment-variables)
  - [3. Build and Run with Docker Compose](#3-build-and-run-with-docker-compose)
  - [4. Accessing the Application](#4-accessing-the-application)

## Features

### Core Features

*   **Apartment Listing:** View a paginated list of available apartments.
*   **Apartment Details:** View detailed information for a specific apartment, including multiple images and its location on a map.
*   **Add Apartment:** A multi-step form to add new apartment listings with image uploads and location input.
*   **Responsive Design:** The frontend is designed to work seamlessly on all devices.
*   **Documentation:** Swagger API documentation for the backend.

### Bonus Features

*   **Search & Filter Functionality:** *not fully implemented*
    *   Filter apartments by price range, area, number of bedrooms/bathrooms, project, and developer.
    *   Sort listings by various criteria (e.g., price, date added).
    *   Universal text search across multiple fields with prioritized results (e.g., numeric input searches unit number, then by name, project, developer using text indexes).
*   **Image Uploads:** Images are uploaded to a third-party service (`freeimage.host` for this demo) and their URLs are stored.
<!-- *   **Persistent Filters:** User filter preferences are saved in cookies, so they are applied on subsequent visits and for server-side rendering of initial results. -->
*   **Map Integration:** Leaflet maps display apartment locations. "Use my current location" feature for adding new listings.
<!-- *   **SEO-friendly Slugs:** Automatically generated for apartment detail pages. -->

## Possible improvmenets

- **Search & Filter Functionality:**
  - Complete Search and filter implementation: Searching & Filtering are only configured for the backend at the moment (due to time constaints). Frontend implementation is halfway down.
  - Implement a partial/fuzzy search for better user experience.
  - Implement a geospatial search for location-based filtering.
  - Implement a caching system for search results to improve performance.
- **Pagination:**
  - Pagination is implmeneted on the serverside. Frontend will requier a small tweak either with multiple pages or an infinite scroller.
- **Caching:**
  - Implement caching for frequently accessed data to reduce database load.
- **Development:**
  - Configure a method to share types between frontend and backend. (likely using Swagger)
- **Testing:**
  - Implement unit and integration tests for the backend and frontend.
- **SEO:**
  - Implement dynamic meta tags for SEO.
- **Persistant Filters:**
  - Implement a method to save user preferences (filters) in cookies for persistent filtering even while SSR.

## Tech Stack

### Backend

*   **Framework:** NestJS (Node.js, TypeScript)
*   **Language:** TypeScript
*   **API Style:** RESTful
*   **Database ORM/ODM:** Mongoose (for MongoDB)
*   **Validation:** DTOS & class-validator
*   **File Uploads:** Handled via `multipart/form-data`, integration with `freeimage.host` (demo).

### Frontend

*   **Framework:** Next.js (React, TypeScript)
*   **Language:** TypeScript
*   **UI Library:** [Mantine UI](https://mantine.dev/)
*   **State Management:** [Zustand](https://github.com/pmndrs/zustand)
*   **Form Handling:** `@mantine/form`
*   **Mapping:** [React Leaflet](https://react-leaflet.js.org/)
*   **Image Carousel:** `@mantine/carousel`
*   **File Dropzone:** `@mantine/dropzone`

### Database

*   **Type:** NoSQL
*   **Database:** MongoDB

### Documentation:
*   **API Documentation:** Swagger (for backend) `localhost:3100/api`

## Project Structure

The project is structured as a monorepo (or can be easily adapted from separate frontend/backend folders within a root directory):

```
.
├── backend/ # NestJS Backend Application
│ ├── Dockerfile
│ ├── .env   
│ └──... (package.json, tsconfig.json, etc.)
│
├── frontend/ # Next.js Frontend Application
│ ├── Dockerfile
│ ├──.env
│ └── ... (package.json, next.config.js, tsconfig.json, etc.)
├── docker-compose.yml # Docker Compose configuration
└── README.md
```

## Getting Started

### 1. Clone the Repository

```bash
git clonegit@github.com:a-essam23/nawy.git nawy-assessment-ae
cd nawy-assessment-ae
```

## 2. Environment Variables

Create `.env` file backend **will be provided in the email**

```ts
NODE_ENV="development"
PORT="3100"
MONGO_URI="mongodb://nawy-assessment-mongodb-1:27017/nawy"
APP_URLS="http://localhost:3000,http://127.0.0.1:3000,localhost:3000"
IMAGE_UPLOAD_API_KEY= (PROVIDED IN EMAIL)
```
## 3. Build and Run with Docker Compose

Run `docker-compose up -d`

This command will:
1- Build the Docker images for the frontend, backend, and pull the MongoDB image.
2- Start the containers for each service.



## 4. Accessing the Application
Frontend: Open your browser and navigate to http://localhost:3000 
Backend API: Accessible at http://localhost:3100 
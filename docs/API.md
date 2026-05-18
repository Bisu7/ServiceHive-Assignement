# GigFlow REST API Documentation

This document describes all API endpoints exposed by the GigFlow backend service. All requests must use the JSON format for body data. When authenticated, requests must attach the JSON Web Token as a bearer token in the `Authorization` header: `Authorization: Bearer <your-jwt-token>`.

---

## Authentication Module

### 1. Register User
Creates a new user profile inside the platform database (default role: `sales`).

*   **Method**: `POST`
*   **Path**: `/api/auth/register`
*   **Authentication Required**: No (Public)
*   **Request Validation**:
    ```typescript
    interface RegisterInput {
      name: string;      // 2-50 characters
      email: string;     // Must be a valid email
      password: string;  // Min 8 characters, at least 1 uppercase letter, at least 1 number
      role?: 'admin' | 'sales';
    }
    ```
*   **Response Shape (201 Created)**:
    ```typescript
    interface RegisterResponse {
      user: {
        _id: string;
        name: string;
        email: string;
        role: 'admin' | 'sales';
        createdAt: string;
        updatedAt: string;
      };
      token: string;
    }
    ```
*   **Errors**:
    *   `400 Bad Request`: Validation failure (e.g. password too weak)
    *   `409 Conflict`: Email already in use
*   **Example curl**:
    ```bash
    curl -X POST http://localhost:5000/api/auth/register \
      -H "Content-Type: application/json" \
      -d '{"name": "Alice Smith", "email": "alice@example.com", "password": "Password123", "role": "sales"}'
    ```

### 2. Login User
Authenticates user credentials and returns a secure JWT access token.

*   **Method**: `POST`
*   **Path**: `/api/auth/login`
*   **Authentication Required**: No (Public)
*   **Request Validation**:
    ```typescript
    interface LoginInput {
      email: string;     // Valid email address
      password: string;  // Non-empty string
    }
    ```
*   **Response Shape (200 OK)**:
    ```typescript
    interface LoginResponse {
      user: {
        _id: string;
        name: string;
        email: string;
        role: 'admin' | 'sales';
        createdAt: string;
        updatedAt: string;
      };
      token: string;
    }
    ```
*   **Errors**:
    *   `401 Unauthorized`: Invalid email or password
*   **Example curl**:
    ```bash
    curl -X POST http://localhost:5000/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email": "admin@leadflow.com", "password": "Admin@123"}'
    ```

### 3. Get Current User Profile
Retrieves the logged-in user profile parameters from the Bearer token.

*   **Method**: `GET`
*   **Path**: `/api/auth/me`
*   **Authentication Required**: Yes (Any role)
*   **Response Shape (200 OK)**:
    ```typescript
    interface UserProfileResponse {
      _id: string;
      name: string;
      email: string;
      role: 'admin' | 'sales';
      createdAt: string;
      updatedAt: string;
    }
    ```
*   **Errors**:
    *   `401 Unauthorized`: Missing, expired, or invalid JWT token
*   **Example curl**:
    ```bash
    curl -X GET http://localhost:5000/api/auth/me \
      -H "Authorization: Bearer <your-jwt-token>"
    ```

### 4. Logout User
Invalidates user sessions and clears server access credentials.

*   **Method**: `POST`
*   **Path**: `/api/auth/logout`
*   **Authentication Required**: Yes (Any role)
*   **Response Shape (200 OK)**:
    ```json
    {
      "message": "Logged out successfully"
    }
    ```
*   **Example curl**:
    ```bash
    curl -X POST http://localhost:5000/api/auth/logout \
      -H "Authorization: Bearer <your-jwt-token>"
    ```

---

## Leads Module

### 1. List Leads
Retrieves a paginated, sorted, and filtered list of active sales pipeline leads.

*   **Method**: `GET`
*   **Path**: `/api/leads`
*   **Authentication Required**: Yes (Any role)
*   **Query String Validation**:
    ```typescript
    interface LeadQuery {
      page?: number;     // Integer >= 1 (default: 1)
      limit?: number;    // Integer between 1 and 100 (default: 10)
      status?: 'new' | 'contacted' | 'qualified' | 'lost';
      source?: 'website' | 'instagram' | 'referral';
      search?: string;   // Text search query for Name or Email
      sortBy?: 'latest' | 'oldest'; // Sorting parameter (default: latest)
    }
    ```
*   **Response Shape (200 OK)**:
    ```typescript
    interface ListLeadsResponse {
      leads: Array<{
        _id: string;
        name: string;
        email: string;
        status: 'new' | 'contacted' | 'qualified' | 'lost';
        source: 'website' | 'instagram' | 'referral';
        notes?: string;
        createdBy: string;
        assignedTo?: string;
        createdAt: string;
        updatedAt: string;
      }>;
      pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
      };
    }
    ```
*   **Example curl**:
    ```bash
    curl -X GET "http://localhost:5000/api/leads?status=qualified&sortBy=latest&limit=5" \
      -H "Authorization: Bearer <your-jwt-token>"
    ```

### 2. Export Leads to CSV
Generates a downloadable CSV stream of matching filtered lead records.

*   **Method**: `GET`
*   **Path**: `/api/leads/export`
*   **Authentication Required**: Yes (admin or sales with export rights)
*   **Query String Validation**:
    ```typescript
    interface ExportQuery {
      status?: 'new' | 'contacted' | 'qualified' | 'lost';
      source?: 'website' | 'instagram' | 'referral';
      search?: string;
    }
    ```
*   **Response Shape (200 OK)**: File attachment stream (text/csv payload containing Name, Email, Status, Source, Notes, Creator, and Registered Date columns).
*   **Example curl**:
    ```bash
    curl -X GET "http://localhost:5000/api/leads/export?status=new" \
      -H "Authorization: Bearer <your-jwt-token>" \
      -o leads-export.csv
    ```

### 3. Create Lead
Registers a new lead in the pipeline.

*   **Method**: `POST`
*   **Path**: `/api/leads`
*   **Authentication Required**: Yes (Any role)
*   **Request Validation**:
    ```typescript
    interface CreateLeadInput {
      name: string;      // 2-100 characters
      email: string;     // Valid email address
      status?: 'new' | 'contacted' | 'qualified' | 'lost';
      source: 'website' | 'instagram' | 'referral';
      notes?: string;    // Max 1000 characters
      assignedTo?: string; // Valid 24-character hex ObjectId
    }
    ```
*   **Response Shape (201 Created)**:
    ```typescript
    interface CreateLeadResponse {
      _id: string;
      name: string;
      email: string;
      status: 'new' | 'contacted' | 'qualified' | 'lost';
      source: 'website' | 'instagram' | 'referral';
      notes?: string;
      createdBy: string;
      assignedTo?: string;
      createdAt: string;
      updatedAt: string;
    }
    ```
*   **Example curl**:
    ```bash
    curl -X POST http://localhost:5000/api/leads \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer <your-jwt-token>" \
      -d '{"name": "Bruce Wayne", "email": "bruce@waynecorp.com", "source": "website", "status": "new", "notes": "Gotham sector lead."}'
    ```

### 4. Get Individual Lead
Retrieves all details for a single lead by its unique ObjectId reference.

*   **Method**: `GET`
*   **Path**: `/api/leads/:id`
*   **Authentication Required**: Yes (Any role)
*   **Response Shape (200 OK)**:
    ```typescript
    interface SingleLeadResponse {
      _id: string;
      name: string;
      email: string;
      status: 'new' | 'contacted' | 'qualified' | 'lost';
      source: 'website' | 'instagram' | 'referral';
      notes?: string;
      createdBy: string;
      assignedTo?: string;
      createdAt: string;
      updatedAt: string;
    }
    ```
*   **Errors**:
    *   `404 Not Found`: Lead with specified ID does not exist
*   **Example curl**:
    ```bash
    curl -X GET http://localhost:5000/api/leads/65f1234567890abcdef12345 \
      -H "Authorization: Bearer <your-jwt-token>"
    ```

### 5. Update Lead
Performs partial schema updates on a lead by its unique ID. At least one parameter is required.

*   **Method**: `PATCH`
*   **Path**: `/api/leads/:id`
*   **Authentication Required**: Yes (Any role)
*   **Request Validation**:
    ```typescript
    interface UpdateLeadInput {
      name?: string;
      email?: string;
      status?: 'new' | 'contacted' | 'qualified' | 'lost';
      source?: 'website' | 'instagram' | 'referral';
      notes?: string;
      assignedTo?: string;
    }
    ```
*   **Response Shape (200 OK)**: Same as single lead object representation containing patched attributes.
*   **Example curl**:
    ```bash
    curl -X PATCH http://localhost:5000/api/leads/65f1234567890abcdef12345 \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer <your-jwt-token>" \
      -d '{"status": "qualified", "notes": "Upgraded package specs."}'
    ```

### 6. Delete Lead
Removes a lead permanently from the pipeline. Administrators are allowed to delete any lead. Non-admin users are only allowed to delete leads that they created.

*   **Method**: `DELETE`
*   **Path**: `/api/leads/:id`
*   **Authentication Required**: Yes (admin role OR owner/creator of the lead record)
*   **Response Shape (200 OK)**:
    ```json
    {
      "message": "Lead deleted successfully"
    }
    ```
*   **Errors**:
    *   `403 Forbidden`: Authenticated user does not possess administrative rights and is not the original creator
*   **Example curl**:
    ```bash
    curl -X DELETE http://localhost:5000/api/leads/65f1234567890abcdef12345 \
      -H "Authorization: Bearer <your-jwt-token>"
    ```

---

## Health Check Module

### 1. Health Check
Fetches active runtime parameters. Requires no database locks or authentication.

*   **Method**: `GET`
*   **Path**: `/api/health`
*   **Authentication Required**: No (Public)
*   **Response Shape (200 OK)**:
    ```typescript
    interface HealthResponse {
      status: 'ok';
      timestamp: string;      // ISO format datetime
      environment: 'development' | 'production' | 'test';
    }
    ```
*   **Example curl**:
    ```bash
    curl -X GET http://localhost:5000/api/health
    ```

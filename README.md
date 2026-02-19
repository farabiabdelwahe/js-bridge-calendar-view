# Calendar Web Application

This is a web-based calendar application for managing consultations and appointments.

## Features

*   Month, Week, and Day views
*   Add, edit, and delete appointments
*   Responsive design for mobile and desktop
*   Dark mode support

## Setup

1.  Clone the repository.
2.  Open `consultation_calendar.html` in your web browser.

## Technologies Used

*   HTML
*   CSS
*   JavaScript

## API Documentation

The application communicates with the backend (or native app wrapper) via a global `API` object. All methods return a `Promise`.

### `getDoctor()`
Retrieves the current doctor's information.
*   **Returns**: `Promise<DoctorData>`
    *   `id`: string
    *   `name`: string
    *   `specialization`: string
    *   `email`: string
    *   `phone`: string

### `setDoctor(doctorData)`
Initializes the doctor context.
*   **Parameters**:
    *   `doctorData`: Object containing doctor details.
*   **Returns**: `Promise<{success: boolean}>`

### `selectDate(from, to)`
Retrieves appointments within a specified date range.
*   **Parameters**:
    *   `from`: Unix timestamp (seconds) or Date object representing the start.
    *   `to`: Unix timestamp (seconds) or Date object representing the end.
*   **Returns**: `Promise<Array<Appointment>>`
    *   `id`: string
    *   `title`: string
    *   `notes`: string
    *   `from`: Unix timestamp (seconds)
    *   `duration_minutes`: number
    *   `patient_id`: string
    *   `type`: "Patient" | "Other"

### `queryPatient(query)`
Searches for patients by name or email.
*   **Parameters**:
    *   `query`: string
*   **Returns**: `Promise<Array<Patient>>`
    *   `id`: string
    *   `name`: string
    *   `email`: string
    *   `phone`: string

### `saveAppointment(appointmentData)`
Creates a new appointment.
*   **Parameters**:
    *   `appointmentData`: Object containing appointment details.
*   **Returns**: `Promise<{code: number, message: string, appointment_id: string}>`

### `editAppointment(appointmentData)`
Updates an existing appointment.
*   **Parameters**:
    *   `appointmentData`: Object containing updated appointment details (must include `appointment_id`).
*   **Returns**: `Promise<{code: number, message: string}>`

### `deleteAppointment(appointmentId)`
Deletes an appointment.
*   **Parameters**:
    *   `appointmentId`: string
*   **Returns**: `Promise<{code: number, message: string}>`

### `goToDetail(appointmentId)`
Navigates to the native detail view for the specified appointment.
*   **Parameters**:
    *   `appointmentId`: string
*   **Returns**: `Promise<{success: boolean}>`

### `setTheme(theme)`
Sets the application theme.
*   **Parameters**:
    *   `theme`: 'light' | 'dark'
*   **Returns**: `Promise<{success: boolean}>`

### `refreshAppointments()`
Triggers the application to reload appointments for the currently active date range.
*   **Returns**: `void` (implementation handled by frontend)

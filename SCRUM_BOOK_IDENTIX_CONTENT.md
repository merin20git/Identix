# IDENTIX Scrum Book Content

Use this content to fill the headings in your Scrum book based on the format in `SCRUM BOOK sona.pdf`.

Replace these placeholders before submission:
- `[Your Name]`
- `[Roll No]`
- `[Batch]`
- `[Guide Name]`
- `[Dates if your actual review dates differ]`

---

## Cover Details

**Name of the Student:** [Your Name]  
**Roll No:** [Roll No]  
**Batch:** [Batch]  
**Name of the Guide:** [Guide Name]  
**Project Title:** IDENTIX - Intelligent Surveillance and Identification System

---

## Sprint Review 1

| Day | Date | Description of Work | Remarks |
|---|---|---|---|
| 1 | 10-12-25 | Topic selection for AI-assisted surveillance and identification system | |
| 2 | 29-12-25 | Synopsis submission including project objective, scope, tentative modules, and proposed tech stack | |

### Description

The project was initiated with the title **IDENTIX - Intelligent Surveillance and Identification System**. The main objective of the project is to assist law enforcement personnel in identifying known criminals and tracing missing persons using uploaded images and CCTV footage. During this sprint, the problem domain was studied, the project objective was finalized, and the synopsis was prepared. The synopsis included the need for role-based access, facial record management, image matching, CCTV analysis, and alert notification. The selected technology direction included a React frontend, FastAPI backend, MongoDB database, and face recognition pipeline using OpenCV and the `face_recognition` library.

---

## Sprint Review 2

| Day | Date | Description of Work | Remarks |
|---|---|---|---|
| 1 | 05-01-26 | Approval of title, started system study, identified frontend, backend, database, and AI tools | |
| 2 | 10-01-26 | Identified modules, designed database collections, and prepared initial UI structure | |

### Description

This sprint focused on title approval, system study, and initial design planning. Existing manual police workflows and fragmented surveillance practices were examined to identify functional gaps. The system modules were defined as authentication, criminal management, missing-person management, suspect image matching, missing-person matching, CCTV analysis, email alerts, and dashboard management. Initial database planning was also done for users, criminals, missing persons, and CCTV match logs. A basic user interface structure was planned separately for administrator and officer roles.

### Modules Completed

- System study and requirement analysis
- Technology stack finalization
- Module identification and planning
- Initial database design
- Initial UI wireframe planning

---

## Sprint Review 3

| Day | Date | Description of Work | Remarks |
|---|---|---|---|
| 1 | 12-01-26 | Progressive Assessment by PAB1 | |
| 2 | 18-01-26 | Project development started with system analysis and design phase | |
| 3 | 28-01-26 | Analysis and design progress completed, around 25% completion achieved | |

### Description

In this sprint, the analysis and design phase of IDENTIX was strengthened. The system workflow for admin and officer roles was prepared, and the logical interaction between frontend, backend, database, and media storage was defined. The project architecture was organized into three layers: presentation layer using React, application layer using FastAPI, and data layer using MongoDB with file-based media storage. The facial matching pipeline was also designed to include face detection, facial embedding extraction, similarity comparison, and match logging. This sprint established the structural foundation required for implementation.

### Modules Completed

- System analysis of surveillance workflow
- Architecture design and module interaction planning
- Record structure definition for criminals and missing persons
- Match workflow design for field image verification
- CCTV scan workflow design for frame-based analysis

---

## Sprint Review 4

| Day | Date | Description of Work | Remarks |
|---|---|---|---|
| 1 | 02-02-26 | Continued development with backend setup and route creation | |
| 2 | 06-02-26 | Coding phase progress and initial code push to GitHub | |
| 3 | 17-02-26 | Major modules integrated and around 50% completion achieved | |

### Description

This sprint focused mainly on coding and backend implementation. FastAPI routes were created for authentication, administrator actions, and officer operations. MongoDB integration was added for storing users, enrolled persons, and detection history. Criminal and missing-person enrollment features were implemented along with facial embedding generation from uploaded images. Role-based access was added to separate admin and officer privileges. At this stage, the system was able to register records, authenticate users, and serve the initial API structure required for further matching and CCTV analysis.

### Modules Completed

- Authentication and JWT-based access control
- Admin and officer route implementation
- Criminal record registration and listing
- Missing-person record registration and listing
- MongoDB connectivity and schema-level field planning
- Initial frontend-backend integration

---

## Sprint Review 5

| Day | Date | Description of Work | Remarks |
|---|---|---|---|
| 1 | 27-02-26 | Continued development, testing, and integration of remaining modules | |
| 2 | 04-03-26 | Around 75% completion achieved and updated code pushed to GitHub | |
| 3 | 10-03-26 | Final implementation of CCTV analysis, matching workflows, and future enhancement study | |
| 4 | 16-03-26 | 100% completion of working prototype and rough documentation completed | |
| 5 | 23-03-26 | Final report preparation, final code organization, and project submission activities | |

### Description

This sprint completed the major functional modules of IDENTIX. Officer-side suspect matching and missing-person matching were integrated with facial comparison logic. CCTV upload and scan functionality was added to process video files, sample frames, compare detected faces with enrolled embeddings, and store matched frames with timestamps. Email alert support was included so that officers could receive notifications when a criminal or missing-person match was found. Frontend dashboards for administrators and officers were completed using React and Tailwind CSS. Testing and final documentation were then carried out. At the end of this sprint, the project functioned as an end-to-end surveillance and identification support platform.

### Modules Completed

- Suspect image match module
- Missing-person image match module
- CCTV upload and automated scan module
- Match history and timestamped frame logging
- Email alert settings and dispatch
- Admin and officer dashboards
- Testing and documentation

---

## Product Backlog

IDENTIX is an AI-assisted surveillance and identification system developed to support police and investigation workflows. The system helps administrators and officers manage criminal records, missing-person records, and CCTV evidence through a single web platform. It allows users to upload images or surveillance footage, detect faces, generate facial embeddings, compare them against stored records, and obtain likely matches with supporting evidence. The application also supports secure login, role-based access control, and email notifications when important detections occur.

The product aims to reduce the delay and inefficiency involved in manual CCTV review and isolated record checking. Instead of depending entirely on human observation, IDENTIX provides an automated assistance layer for image-based suspect verification, missing-person identification, and surveillance-based search. By integrating a React frontend, FastAPI backend, MongoDB database, and computer vision services, the project offers a practical and modular platform that can be extended in the future.

### System Study Overview

IDENTIX was studied as a full-stack intelligent identification platform that combines computer vision, secure web application design, and database-driven record management. The project uses facial images enrolled by administrators as known records and compares them with field images or CCTV frames during detection. The backend handles authentication, record management, face encoding, similarity comparison, email alerts, and video analysis. The frontend provides interfaces for administrators and officers to manage records and use the matching features in a clear and accessible manner.

### Key Findings

1. **User Requirements:** Police-oriented users require a simple and secure platform to maintain criminal and missing-person records, perform image-based verification, upload CCTV footage, and review match history without depending on multiple disconnected tools.
2. **Current Limitations:** Traditional surveillance workflows are largely manual, time-consuming, and poorly integrated. CCTV footage often requires human review, and criminal or missing-person details may be scattered across separate records.
3. **Opportunities:** IDENTIX integrates face recognition, CCTV frame analysis, database management, and alerting in one platform. This improves response time, traceability, and operational efficiency while also providing a foundation for future upgrades such as live camera processing and advanced face detectors.

---

## System Components Analyzed

### Sprint Review 1: Topic Selection and Synopsis Submission

**Day/Date:**
- 10-12-25: Topic selection
- 29-12-25: Synopsis submission

**Description:**  
The project idea was finalized around the need for intelligent surveillance assistance in criminal identification and missing-person tracing. The synopsis outlined the system objective, major modules, expected workflow, and proposed technology stack. The project was positioned as a real-world application of computer vision and full-stack development.

### Sprint Review 2: Title Approval, System Study, and Initial Design

**Day/Date:**
- 05-01-26: Title approved and system study initiated
- 10-01-26: Module identification and initial UI/database planning completed

**Modules Completed:**
- Requirement analysis for administrator and officer roles
- Module mapping for criminal management, missing-person management, matching, CCTV analysis, and alerts
- Initial UI planning for dashboards and forms
- Initial database design for user and detection records

**Description:**  
This sprint focused on understanding the real workflow requirements and converting them into a structured module plan. It also defined the initial user interface direction and storage design for the application.

### Sprint Review 3: Analysis, Design, and Progressive Assessment

**Day/Date:**
- 12-01-26: Progressive Assessment by PAB1
- 18-01-26: Development continued with system analysis and architectural design
- 28-01-26: Approximately 25% completion achieved

**Modules Completed:**
- Architecture planning
- Backend route flow design
- Image and CCTV match workflow planning
- Record schema definition

**Description:**  
This sprint established the technical blueprint of the system, including architecture, media storage flow, and database interaction. The matching logic and role-specific workflows were finalized before implementation.

### Sprint Review 4: Coding Phase Progress

**Day/Date:**
- 02-02-26: Backend setup and API development continued
- 06-02-26: Initial code push to GitHub
- 17-02-26: Around 50% completion achieved

**Modules Completed:**
- FastAPI backend setup
- JWT authentication
- Criminal and missing-person CRUD operations
- MongoDB integration
- Initial frontend page setup

**Description:**  
At this stage, the project transitioned from planning into implementation. Core APIs and record management capabilities were developed, forming the basis for the final intelligent matching features.

### Sprint Review 5: Project Implementation, Testing, and Finalization

**Day/Date:**
- 27-02-26: Development and integration continued
- 04-03-26: Around 75% completion achieved
- 10-03-26: Final intelligent modules integrated
- 16-03-26: Documentation completed
- 23-03-26: Final submission and review activities completed

**Modules Completed:**
- Suspect and missing-person image matching
- CCTV video scan and frame extraction
- Email alert integration
- Officer dashboard and search features
- Final testing and documentation

**Description:**  
All modules were integrated and tested successfully. The system demonstrated coordinated interaction between the frontend, backend, database, face-recognition services, and evidence storage components.

---

## Data Base and User Interface Design

IDENTIX uses **MongoDB** as the primary database for storing user accounts, criminal records, missing-person records, and CCTV match history. Media files such as profile images, CCTV uploads, and matched frames are stored in organized directories under the backend data folder. The backend, implemented with **FastAPI**, performs facial encoding, comparison, authentication, and media handling. The frontend, built with **React** and **Tailwind CSS**, provides separate dashboards and task-oriented interfaces for administrators and officers. Communication between frontend and backend is performed through REST APIs, ensuring structured and efficient data flow.

The UI design was planned to be simple, role-specific, and easy to use during operational workflows. Important tasks such as uploading records, searching criminals, matching a suspect image, or scanning CCTV footage are presented as direct actions from the dashboard. The design focuses on usability, quick navigation, and clear presentation of detection results.

### Schemas

#### Users

- `username`
- `full_name`
- `email`
- `role`
- `password_hash`

#### Criminals

- `_id`
- `full_name`
- `crime`
- `last_known_location`
- `dob`
- `gender`
- `national_id`
- `notes`
- `image_path`
- `embedding`
- `created_at`

#### Missing Persons

- `_id`
- `full_name`
- `last_seen`
- `dob`
- `gender`
- `national_id`
- `notes`
- `image_path`
- `embedding`
- `created_at`

#### CCTV Match History

- `person_id`
- `person_name`
- `similarity`
- `frame_path`
- `timestamp_ms`
- `video_path`
- `created_at`
- `source`

---

## UI Components

### 1. Login Page

The login page is the secure entry point of the IDENTIX system. It allows administrators and officers to sign in using their credentials. After successful authentication, the user is redirected to the role-specific dashboard.

### 2. Role Selection / Dashboard Page

The system provides separate dashboard views for administrators and officers. The admin dashboard focuses on record management, officer management, CCTV upload, and email settings. The officer dashboard focuses on suspect verification, missing-person matching, criminal search, and viewing accessible records.

### 3. Criminal Management Page

This page allows administrators to add, view, search, and delete criminal records. Each record includes personal details, crime information, image upload, and generated facial embedding used for future matching.

### 4. Missing-Person Management Page

This page stores and manages missing-person details along with uploaded images. It supports record addition, retrieval, and follow-up identification tasks. In the current implementation, officers can also work with missing-person records for operational convenience.

### 5. Suspect Match Page

This page allows an officer to upload a suspect image and compare it with the enrolled criminal database. The page displays the matched criminal details, similarity score, stored image, and any related CCTV detections if available.

### 6. Missing Match Page

This page is used to upload the image of a found or suspected missing person. The system compares the uploaded image with the missing-person database and returns the best valid match with supporting information.

### 7. CCTV Upload Page

This page is mainly intended for administrators to upload one or more CCTV video files. The system scans the footage, extracts frames at intervals, detects possible matches, and displays the results with timestamps and saved evidence frames.

### 8. Criminal Search Page

This page helps officers search the criminal database by name and quickly access relevant record details without manually browsing the entire dataset.

### 9. Email Settings Page

This page allows the administrator to configure SMTP settings required for sending match alert emails to officers. It also supports sending a test email to verify the configuration.

---

## Testing and Validation

### 1. Integration Testing

Integration testing was used to ensure that the frontend, backend, database, face-recognition services, and media storage worked together correctly. Tests were carried out to confirm that record creation, image upload, matching, CCTV analysis, and alert generation flowed correctly across all modules. This helped verify that the system behaved as a complete end-to-end application rather than as isolated components.

### 2. Authentication and Access Control Testing

This testing verified secure user authentication and role-based access control. The system was checked to ensure that only administrators could manage officers, upload CCTV footage, and update email settings, while officers could perform suspect matching, missing-person matching, and search operations. Invalid logins and unauthorized route access were also considered.

### 3. Functional Testing

Functional testing verified that each core feature behaved correctly during normal usage. Important test cases included admin login, officer login, criminal registration, missing-person registration, suspect image matching, missing-person image matching, CCTV upload and scan, criminal search, and email alert dispatch. The purpose was to confirm that the system delivered the expected output for valid inputs and handled user workflows correctly.

### 4. Error Handling and Edge Case Testing

The system was tested with incorrect or low-quality inputs such as invalid credentials, images without detectable faces, incomplete form submissions, and unauthorized requests. The application was validated to return meaningful error messages and avoid crashes. This improved reliability and made the system safer to use in practical conditions.

### Validation

**Frontend Validation:**  
Frontend forms were validated to reduce invalid submissions and improve user experience. Required fields, file uploads, and form structure were checked before data was submitted to the backend.

**Backend Validation:**  
The backend validated required fields, authentication state, and detectable-face conditions before saving records or running matching operations. This ensured that malformed or incomplete requests were rejected safely.

**Face Matching Validation:**  
The matching pipeline was validated by checking whether uploaded images containing enrolled persons produced the expected similarity-based result. Threshold-based filtering was used so that only reliable matches were returned.

**CCTV Validation:**  
The CCTV module was validated by uploading sample videos and confirming that matching frames, timestamps, and result logs were stored correctly. Frame sampling helped balance computational load and detection coverage.

---

## Details of Versions

### Version 1.0.0 - Initial Project Setup

**Sprint Time:** Sprint 1  
**Push Description:**  
Established the foundational structure of IDENTIX. The project idea, objectives, and basic architecture were finalized. Initial frontend and backend folders were prepared, and the core technology stack was selected.

**Features:**
- Project topic finalized
- Synopsis prepared
- Base architecture planned
- Stack identified as React, FastAPI, MongoDB, OpenCV, and `face_recognition`

**Repository:** [Insert GitHub repository link]

### Version 1.1.0 - Authentication and Record Management

**Sprint Time:** Sprint 2  
**Push Description:**  
Implemented the core backend and data management features. Added user authentication, role handling, and CRUD operations for criminal and missing-person records. This version established the main data flow of the application.

**Features:**
- JWT-based authentication
- Admin and officer role separation
- Criminal record registration and listing
- Missing-person record registration and listing
- MongoDB integration

**Repository:** [Insert GitHub repository link]

### Version 1.2.0 - Face Matching and Search Features

**Sprint Time:** Sprint 3  
**Push Description:**  
Integrated face processing and matching features. Added officer-side suspect matching, missing-person matching, and criminal search support. Matching results were connected to stored facial embeddings and existing records.

**Features:**
- Suspect image matching against criminal database
- Missing-person image matching
- Similarity score generation
- Criminal search by name
- Match history support for uploaded field images

**Repository:** [Insert GitHub repository link]

### Version 1.3.0 - CCTV Analysis, Alerts, and Finalization

**Sprint Time:** Sprint 4  
**Push Description:**  
Completed the advanced functional modules of the system. Added CCTV upload and scanning, frame extraction, timestamped detection logs, email alert configuration, and final frontend integration. Testing and documentation were also completed in this phase.

**Features:**
- CCTV video upload and scan
- Frame-wise face matching
- Timestamped evidence storage
- Email alert integration
- Final admin and officer dashboard workflow
- Testing and documentation

**Repository:** [Insert GitHub repository link]

---

## Suggested Screenshot Headings for the Scrum Book

- Login Page
- Admin Dashboard
- Officer Dashboard
- Criminal Record Management
- Missing-Person Record Management
- Suspect Match Result
- Missing Match Result
- CCTV Upload and Detection Result
- Criminal Search Page
- Email Settings Page


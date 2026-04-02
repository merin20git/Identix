# IDENTIX
## Intelligent Surveillance and Identification System

Report draft prepared according to:
- `Main Project- contents of Report.pdf`
- `CommonInstructions- Main Project Report.pdf`

Use this draft as the base content for your final Word/PDF submission. Replace bracketed placeholders with your actual details, add screenshots, and format it in Times New Roman as required by the guidelines.

---

## 1. Cover Page

**Project Title:** IDENTIX - Intelligent Surveillance and Identification System

**Submitted by:** [Your Name]

**Register Number:** [Your Register Number]

**Course:** [Your Course / Programme]

**Department:** Department of Computer Science and Engineering

**Institution:** Federal Institute of Science and Technology (FISAT)

**Submission Month and Year:** March 2026

**Project Guide:** [Guide Name]

**Principal:** Dr. Jacob Thomas V

---

## 2. Declaration

I hereby declare that the project report titled **"IDENTIX - Intelligent Surveillance and Identification System"** is a bona fide record of the work carried out by me during the academic year 2025-2026 under the guidance of [Guide Name], Department of Computer Science and Engineering, Federal Institute of Science and Technology. I further declare that this work has not been submitted fully or partly for the award of any other degree, diploma, title, or recognition in this institution or any other institution.

**Place:** [Place]  
**Date:** [Date]  
**Name and Signature of Student:** [Your Name]

---

## 3. Certificate from College / Company

Use the exact certificate format provided by your department or college. Insert the approved wording and signatures here.

Suggested title:

**CERTIFICATE**

This is to certify that the project report entitled **"IDENTIX - Intelligent Surveillance and Identification System"** is a record of the project work carried out by [Student Name] under our supervision in partial fulfillment of the requirements for the award of the degree [Degree Name] of APJ Abdul Kalam Technological University during the academic year 2025-2026.

**Project Guide:** [Guide Name]  
**Head of Department:** [HOD Name]  
**Principal:** Dr. Jacob Thomas V

---

## 4. Certificate from Department

Insert the department certificate in the prescribed format supplied by your department.

---

## 5. Acknowledgement

I express my sincere gratitude to Almighty God for providing me with the strength and determination to complete this project successfully.

I wish to place on record my heartfelt thanks to the management and faculty members of the Federal Institute of Science and Technology for providing the academic environment and technical facilities required for the completion of this work. I am deeply indebted to **Dr. Jacob Thomas V**, Principal, FISAT, for the institutional support extended to me.

I extend my sincere thanks to the Head of the Department of Computer Science and Engineering and my project guide, **[Guide Name]**, for the constant encouragement, expert guidance, and valuable suggestions throughout the development of this project. Their constructive feedback helped me refine both the technical implementation and the documentation.

I also thank all the faculty members, classmates, friends, and family members who supported me directly and indirectly during the course of this project. Their motivation and encouragement played an important role in the successful completion of this work.

---

## 6. Abstract

IDENTIX is an AI-assisted surveillance and identification system developed to support law enforcement personnel in detecting known criminals and tracing missing persons from still images and CCTV footage. The system combines face detection, facial embedding generation, similarity-based matching, role-based access control, and real-time alerting within a full-stack web application. The application provides two major user roles: administrator and officer. Administrators can register criminal and missing-person records, manage officer accounts, upload CCTV footage, and configure email alerts. Officers can perform suspect verification, missing-person matching, and criminal database search operations.

The backend of the system is implemented using FastAPI, while the frontend uses React and Tailwind CSS. MongoDB is used as the central data store for users, facial records, and match history. For computer vision operations, the system uses Haar Cascade based face detection, the `face_recognition` library for facial encodings, and OpenCV for video frame processing. When a potential match is found, the system stores the detected frame, logs the match with timestamp information, and can automatically notify registered officers through HTML email alerts.

The project addresses the limitations of manual surveillance, delayed communication, and fragmented record access. It provides a unified digital platform for criminal database management, missing-person assistance, and CCTV analysis. The proposed system improves operational efficiency by reducing manual screening effort, enabling faster identification workflows, and presenting results through an accessible dashboard. The project demonstrates how AI-based facial analysis can be integrated into a practical police support platform while keeping the overall architecture modular and extensible for future enhancements.

---

## TABLE OF CONTENTS

Prepare the final table of contents automatically in Word after applying heading styles. Use the chapter order below:

1. Introduction  
1.1 Organizational Profile  
1.2 Scope of the Work  
2. Proof of Concept  
2.1 Review of Literatures  
2.2 Existing System  
2.3 Limitation of Existing Models / Systems  
2.4 Objectives  
2.5 Proposed System  
3. System Analysis and Design  
3.1 System Analysis  
3.1.1 Introduction  
3.1.2 Methodology  
3.1.3 Hardware and Software Requirements  
3.2 System Design  
3.2.1 Introduction  
3.2.2 Module Description  
3.2.3 System Architecture / UML Diagrams  
3.2.4 Database / Datasets  
3.3 Issues Faced and Remedies Taken  
4. Results and Discussion  
4.1 Testing, Test Cases and Test Results  
4.2 Results / Performance Evaluation / Screenshots  
4.3 Results Comparison  
5. Conclusion and Future Scope  
5.1 Conclusion  
5.2 Future Enhancements  
6. Appendix  
6.1 Source Code  
6.2 Screenshots  
6.3 List of Abbreviations  
7. References

---

# 1. INTRODUCTION

The increasing use of surveillance cameras in public and private spaces has created a large volume of visual data that cannot be effectively monitored by human observers alone. Traditional surveillance systems depend heavily on manual review of CCTV footage, delayed communication between officers, and fragmented record keeping. These limitations reduce the speed and accuracy of criminal identification and missing-person tracing, especially in time-sensitive situations.

Artificial intelligence and computer vision techniques offer a practical solution to this problem. Face detection and face recognition systems can automate the identification process by detecting faces in images or videos and comparing them against a known database of enrolled subjects. When integrated with web technologies and secure user management, these techniques can become part of an operational decision-support system for law enforcement agencies.

The project titled **IDENTIX - Intelligent Surveillance and Identification System** was developed with this goal. The system is designed as a full-stack web application that helps police personnel maintain a criminal and missing-person database, upload CCTV footage, perform face matching, and receive notifications when a possible match is detected. The system brings together image-based field identification, video analysis, and secure digital record access in a single platform.

### 1.1 Organizational Profile

This project was carried out in the academic environment of the **Department of Computer Science and Engineering, Federal Institute of Science and Technology (FISAT)**. The department provides a strong foundation in software engineering, data management, artificial intelligence, and modern web technologies. The academic setting supported the project through faculty guidance, computing resources, and exposure to current trends in machine learning and full-stack development.

The institutional environment encourages application-oriented learning, and this project reflects that approach by solving a socially relevant problem using practical engineering methods. The work also aligns with interdisciplinary themes such as computer vision, cybersecurity, data systems, and digital governance.

### 1.2 Scope of the Work

The scope of IDENTIX includes the following:

- development of a secure web platform for police-oriented identification workflows
- storage and management of criminal and missing-person facial records
- field image matching against a criminal database
- field image matching against a missing-person database
- CCTV footage upload and automated frame-by-frame analysis
- timestamp-based logging of detected matches
- officer notification through email alerts
- role-based access for administrators and officers

The current project focuses on face-based identification support and not on legal decision-making. The final action remains with authorized personnel. The platform is intended as a technical assistance tool that reduces search time and improves access to structured evidence.

---

# 2. PROOF OF CONCEPT

The proof of concept for IDENTIX demonstrates that a practical surveillance support platform can be built using existing face recognition libraries, a lightweight API backend, a web-based dashboard, and a database-driven workflow. The core idea is to transform uploaded images and CCTV frames into facial embeddings and compare them with previously stored embeddings in the criminal and missing-person collections.

The success of the concept depends on four technical assumptions:

- faces can be detected reliably in uploaded images and selected video frames
- detected faces can be converted into stable embeddings
- embeddings from known records and probe samples can be compared using distance-based similarity
- matched events can be persisted and communicated through a usable operational interface

The current implementation validates these assumptions through a working prototype built with FastAPI, React, MongoDB, OpenCV, Haar Cascade based face detection, and `face_recognition` embeddings.

## 2.1 Review of Literatures

The literature review focuses on face detection and face recognition methods that influenced the design of IDENTIX. As required in the guidelines, each review includes methodology, findings, accuracy, and conclusion.

### Paper 1: DeepFace: Closing the Gap to Human-Level Performance in Face Verification

**Methodology / Algorithm Used:**  
Taigman et al. proposed DeepFace, a deep learning based face verification framework that combines 3D face alignment with a nine-layer deep neural network. The method revisited the traditional face-recognition pipeline by improving alignment and representation learning simultaneously.

**Findings:**  
The study showed that precise alignment significantly improves deep feature learning. By training on a very large facial dataset and using learned feature representations, the model reduced the gap between machine and human performance in unconstrained face verification.

**Accuracy of Results:**  
The paper reported **97.35% accuracy on the Labeled Faces in the Wild (LFW) dataset**.

**Conclusion:**  
DeepFace demonstrated that deep neural networks can outperform many traditional handcrafted-feature approaches in face verification. The paper established deep learning as a dominant direction for modern face recognition research.

### Paper 2: FaceNet: A Unified Embedding for Face Recognition and Clustering

**Methodology / Algorithm Used:**  
Schroff et al. introduced FaceNet, which directly learns a mapping from face images to a compact Euclidean embedding space using triplet loss. Instead of training a classifier first and using intermediate features, FaceNet learns embeddings whose distances encode facial similarity.

**Findings:**  
The work proved that compact embeddings can support face verification, recognition, and clustering with high efficiency. The idea of comparing learned embeddings with a similarity threshold strongly influenced many later face-recognition systems.

**Accuracy of Results:**  
The paper reported **99.63% accuracy on LFW** and **95.12% accuracy on YouTube Faces DB**.

**Conclusion:**  
FaceNet is highly relevant to IDENTIX because the current project also uses embedding-based face comparison. The paper demonstrated that distance-based facial representation is practical, efficient, and scalable for recognition tasks.

### Paper 3: Joint Face Detection and Alignment Using Multi-task Cascaded Convolutional Networks

**Methodology / Algorithm Used:**  
Zhang et al. proposed MTCNN, a cascaded three-stage deep convolutional architecture for face detection and facial landmark localization. The model performs coarse-to-fine prediction and uses online hard sample mining to improve robustness in unconstrained settings.

**Findings:**  
The paper showed that combining detection and alignment in one cascaded framework improves performance under variations in pose, illumination, and occlusion. It became one of the most widely used face-detection pipelines in practical systems.

**Accuracy of Results:**  
The authors reported **superior performance over previous methods on FDDB, WIDER FACE, and AFLW benchmarks**, while maintaining real-time capability. Exact benchmark values can be inserted from the final paper table if your department requires them explicitly.

**Conclusion:**  
MTCNN highlighted the importance of robust face detection before recognition. Although IDENTIX currently uses Haar Cascade for simplicity and speed, this paper supports future migration toward more accurate deep face detectors.

### Paper 4: CosFace: Large Margin Cosine Loss for Deep Face Recognition

**Methodology / Algorithm Used:**  
Wang et al. proposed CosFace, which reformulates the softmax objective using L2-normalized features and classifier weights, then introduces a cosine margin term to increase inter-class separation and reduce intra-class variation.

**Findings:**  
The work showed that margin-based metric learning significantly improves discriminative face representations. The approach is especially important for open-set recognition, where unseen identities must still be separated effectively.

**Accuracy of Results:**  
The paper reported strong results on common benchmarks, including **99.33% on LFW**, **96.1% on YTF**, and improved MegaFace performance for the normalized model configuration reported in the paper.

**Conclusion:**  
CosFace is relevant because it improves embedding discrimination, which is directly connected to the similarity-based comparison used in IDENTIX. It points toward future accuracy improvements beyond the current baseline library implementation.

### Paper 5: RetinaFace: Single-Shot Multi-Level Face Localisation in the Wild

**Methodology / Algorithm Used:**  
Deng et al. proposed RetinaFace, a single-shot face localization method that jointly predicts face boxes, 2D facial landmarks, and 3D face structure cues. The method improves difficult face detection cases through multi-task learning and richer supervision.

**Findings:**  
The study showed that accurate face localization can be achieved together with alignment and 3D information using a unified model. The method was especially effective for small, occluded, and difficult faces in unconstrained scenes.

**Accuracy of Results:**  
The supplementary results reported **96.9% (Easy), 96.3% (Medium), and 92.2% (Hard)** average precision on the WIDER FACE validation subsets for the RetinaFace-ResNet152 model, with similarly strong performance on the test subsets.

**Conclusion:**  
RetinaFace is highly suitable for future versions of IDENTIX because CCTV footage often contains difficult surveillance faces. Replacing Haar Cascade with RetinaFace or a similar detector can substantially improve detection quality in challenging scenes.

### Literature Review Summary

The literature makes three points clear:

- modern surveillance systems depend on robust face detection before recognition
- embedding-based recognition is more practical than direct class prediction for real-world identity comparison
- deep margin-based models significantly improve recognition accuracy in open-set environments

IDENTIX adopts these insights in a simplified and deployable form by using face embeddings, similarity comparison, and modular backend services.

## 2.2 Existing System

In conventional police workflows, criminal verification and missing-person tracing are often carried out using manual observation, isolated record systems, verbal communication, and delayed review of surveillance footage. CCTV data may exist, but finding a person of interest typically requires officers to inspect footage manually or depend on separate software tools that are not integrated with case records.

Many smaller institutions also rely on basic image storage without automated facial matching. In such environments:

- criminal data is stored as static records
- missing-person reports are managed separately
- CCTV review is manual and time-consuming
- no automatic alert is generated when a match is found
- field verification is disconnected from central records

## 2.3 Limitation of Existing Models / Systems

The limitations of the existing approach are as follows:

- high dependence on human observation and memory
- slow processing of large CCTV archives
- absence of centralized and role-controlled record access
- limited real-time response capability
- delayed communication between administrators and field officers
- low scalability when the number of records increases
- no structured logging of detection history and timestamp evidence

From a technical perspective, many standalone recognition models also suffer from one or more of the following:

- poor robustness under low lighting, occlusion, and pose variation
- difficulty in handling multiple faces in a video
- lack of integration with an operational dashboard
- no audit trail for detected matches

## 2.4 Objectives

- to develop a centralized identification platform for criminal and missing-person management
- to automate facial matching from field images and CCTV footage
- to reduce the time required for suspect verification and missing-person tracing
- to provide role-based access for administrators and officers
- to store and retrieve facial records efficiently using a database-driven architecture
- to log match events with frame evidence and timestamps
- to send alert emails when important matches are detected
- to provide a user-friendly web dashboard for operational use

## 2.5 Proposed System

The proposed system, IDENTIX, is a full-stack AI-assisted web application that integrates face recognition, CCTV analysis, database management, and secure access control.

The system works in the following sequence:

1. an administrator enrolls criminal or missing-person records with profile data and image
2. the backend extracts a facial embedding from the uploaded image and stores it in MongoDB
3. an officer uploads a suspect image or found-person image, or an administrator uploads CCTV footage
4. the system detects faces, generates embeddings, and compares them with stored embeddings
5. when similarity is above the accepted threshold, the system returns the best match
6. matched video frames are saved with timestamps
7. officer notifications can be sent through email

The proposed system improves speed, structure, and usability compared to manual processes while remaining extensible for future improvements such as deep detectors, mobile deployment, and live camera support.

---

# 3. SYSTEM ANALYSIS AND DESIGN

## 3.1 System Analysis

### 3.1.1 Introduction

System analysis is the process of studying user requirements, operational constraints, data flow, and technology choices before implementation. In IDENTIX, system analysis was necessary because the project combines multiple technical concerns: image processing, database management, secure authentication, role-based workflows, and frontend usability.

The main users of the system are:

- **Administrator:** manages criminal records, missing-person records, officer accounts, CCTV uploads, and email settings
- **Officer:** performs suspect matching, missing-person verification, and criminal search operations

The functional requirements identified during analysis were:

- secure login and role validation
- image upload and facial record creation
- criminal and missing-person record listing and deletion
- suspect matching from uploaded image
- missing-person matching from uploaded image
- CCTV footage analysis against stored facial embeddings
- display of results with timestamps and evidence frames
- email alert delivery

The non-functional requirements included:

- simple interface for non-technical users
- acceptable response time for moderate-size datasets
- maintainable backend architecture
- modular services for recognition, video scanning, and email
- persistent storage of records and match logs

### 3.1.2 Methodology

The development methodology followed for IDENTIX was an incremental prototype-driven approach influenced by Agile and Scrum principles. Instead of attempting to implement the entire system in one stage, the project was divided into smaller functional increments that could be developed, reviewed, tested, and improved continuously. This approach was appropriate because the project combined backend APIs, face recognition workflows, CCTV processing, database design, and frontend dashboards, all of which benefited from repeated validation.

The work progressed through short development cycles in which a small set of features was selected, implemented, verified, and refined. At the end of each cycle, the working prototype was reviewed against the original objectives and practical issues encountered during usage. This iterative style helped in identifying usability gaps, correcting integration issues between frontend and backend, and improving the reliability of the matching workflow before moving to the next feature.

The stages followed were:

1. requirement analysis and identification of admin and officer workflows
2. design of the FastAPI backend structure and route separation
3. MongoDB schema planning for users, criminal records, missing-person records, and CCTV match logs
4. implementation of face detection and facial embedding generation using Haar Cascade and `face_recognition`
5. development of JWT-based authentication and role protection
6. creation of the React dashboard and page-wise navigation for both user roles
7. implementation of suspect match and missing-person match features
8. development of CCTV upload, frame sampling, and timestamp-based detection logging
9. addition of SMTP-based email alert support and settings management
10. integration testing, UI refinement, and report preparation

This methodology was suitable because the project required frequent feedback and progressive improvement. A prototype-first process made it possible to validate the recognition pipeline early, then extend it into a complete full-stack application with better confidence and lower rework.

### 3.1.3 Hardware and Software Requirements

#### Hardware Requirements

- Processor: Intel Core i5 or above
- RAM: Minimum 8 GB
- Storage: Minimum 256 GB
- Camera: Optional, for image acquisition
- GPU: Optional, not mandatory for current prototype

#### Software Requirements

- Operating System: Windows 10 / 11 or Linux
- Frontend: React, Vite, Tailwind CSS
- Backend: FastAPI
- Programming Language: Python, JavaScript
- Database: MongoDB
- Computer Vision Libraries: OpenCV, face_recognition, PIL, NumPy
- Authentication: JWT
- Email Service: SMTP based alerting
- Development Tools: VS Code, Git, Postman / browser

## 3.2 System Design

### 3.2.1 Introduction

System design transforms the identified requirements into modules, workflows, interfaces, and data structures. IDENTIX uses a modular full-stack architecture so that each major function can be independently maintained and improved. The design separates the presentation layer, API layer, recognition services, and data layer.

### 3.2.2 Module Description

IDENTIX contains the following major modules.

#### 1. Authentication Module

This module manages secure login, password hashing and verification, JWT token generation, and role-based access control. It ensures that only authenticated users can access protected routes. The implementation supports administrator and officer roles, and also includes bootstrap support for creating the initial admin account during first-time setup.

#### 2. Criminal Management Module

This module allows the administrator to add, list, search, and delete criminal records. Each record stores identifying details such as name, crime, last known location, gender, date of birth, national ID, notes, profile image, and the extracted face embedding used for future comparisons.

#### 3. Missing Person Management Module

This module stores missing-person reports together with profile images and face embeddings. In the current prototype, both administrators and officers can view and manage missing-person entries so that field-level updates can be handled more quickly during search operations.

#### 4. Suspect Match Module

This module allows officers to upload a suspect photograph and compare it against all enrolled criminal embeddings. If one or more faces are detected, the system evaluates each encoding, selects the best valid match within the configured threshold, and returns the identified person with similarity score and any previously stored CCTV detections. The uploaded field image is also saved as part of the detection history.

#### 5. Missing Match Module

This module allows officers to upload the image of a found or suspected missing person and compare it against the missing-person database. When a valid match is found, the system returns the missing-person details, similarity score, and previously recorded CCTV detections, while also storing the newly uploaded field image for audit and follow-up.

#### 6. CCTV Analysis Module

This module accepts one or more uploaded CCTV video files, samples frames at a configurable interval, detects faces in the selected frames, computes embeddings, and compares them against known records. It can search against criminals, missing persons, or both collections together. When a match is found, the system stores the annotated frame with timestamp information and logs the event in the database.

#### 7. Email Alert Module

This module sends formatted email alerts to all registered officers whenever a criminal or missing-person match is detected through field upload or CCTV analysis. The SMTP configuration is maintained through the admin interface, and the alerts can include subject details, confidence score, timestamp information, and linked or embedded evidence images.

#### 8. Dashboard and Reporting Module

This module provides the React-based user interface for administrators and officers. It includes dashboards, protected navigation, criminal and missing-person management pages, CCTV upload screens, suspect and missing-person match pages, criminal search tools, and email settings screens. The interface is designed to present results clearly to users who may not have deep technical knowledge.

### 3.2.3 System Architecture / UML Diagrams

#### Architecture Description

The system follows a three-layer architecture:

- **Presentation Layer:** React frontend for user interaction
- **Application Layer:** FastAPI routes and service modules
- **Data Layer:** MongoDB collections and file-based media storage

#### Textual Architecture Diagram

```text
User
  |
  v
React Frontend
  |
  v
FastAPI Backend
  |-- Authentication Service
  |-- Criminal / Missing Record APIs
  |-- Face Recognition Service
  |-- Video Analysis Service
  |-- Email Alert Service
  |
  +--> MongoDB Database
  +--> Media Storage (images, videos, frames)
```

#### Use Case Summary

- Admin logs in
- Admin adds criminal / missing-person records
- Admin manages officers
- Admin uploads CCTV footage
- Officer logs in
- Officer performs suspect match
- Officer performs missing-person match
- Officer searches criminal records
- System sends alerts after successful detection

#### Suggested UML Diagrams to Draw in the Final Report

Add the following diagrams as figures in Word:

- Use Case Diagram for Admin and Officer
- Activity Diagram for Suspect Match
- Activity Diagram for CCTV Upload and Match Detection
- Class Diagram for core entities (`User`, `PersonOut`, `MatchResult`, `CCTVMatch`)
- Sequence Diagram for image upload -> embedding -> match -> alert

### 3.2.4 Database / Datasets

#### Database Design

MongoDB is used because the project handles flexible record structures, frequent insertions of detection logs, and evolving metadata fields. The main collections are:

- `users`
- `criminals`
- `missing`
- `cctv_matches`

#### Key Stored Fields

**users**
- `_id`
- `username`
- `full_name`
- `email`
- `role`
- `password_hash`

**criminals**
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

**missing**
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

**cctv_matches**
- `person_id`
- `person_name`
- `similarity`
- `frame_path`
- `timestamp_ms`
- `video_path`
- `created_at`
- `source`

#### Datasets Used

The current project uses a locally maintained project dataset created by the administrator through record enrollment. Instead of training a deep model from scratch, the system uses pre-built facial encoding support through the `face_recognition` library and performs comparison on user-maintained images.

The project data sources include:

- uploaded criminal face images
- uploaded missing-person face images
- uploaded CCTV videos
- extracted frame images generated during analysis

#### Matching Logic

The system stores face embeddings as numeric arrays. During matching:

- the uploaded image or sampled video frame is converted to RGB format
- faces are localized using Haar Cascade based detection
- `face_recognition` generates 128-dimensional face encodings for the detected faces
- Euclidean face distance is computed between the probe encoding and stored embeddings
- the best match is selected using minimum distance
- only matches within the configured threshold of `0.6` are accepted
- the similarity score is reported as `1 - distance`
- for CCTV analysis, frames are processed with a default `frame_stride` of `15` to reduce cost
- accepted detections are stored with frame path, timestamp, and source information for later review

## 3.3 Issues Faced and Remedies Taken

### 3.3.1 Issues

Several issues were encountered during the development of the system:

- difficulty in detecting faces from low-quality or angled images
- false negatives when the uploaded image had poor lighting
- computational delay during video scanning for large footage files
- need for media path normalization between backend and frontend
- handling multiple user roles and route protection cleanly
- ensuring email alerts remain optional when SMTP is not configured
- maintaining consistency between stored person records and detection history

### 3.3.2 Remedies

The following remedies were applied:

- Haar Cascade based face localization was used as a lightweight and easily deployable first-stage detector
- the largest detected face was selected during single-face enrollment to reduce ambiguity in stored records
- frame skipping through configurable `frame_stride` was introduced to reduce CCTV processing cost
- media files were organized into separate folders for criminal images, missing-person images, uploads, and matched frames
- saved media was exposed through a static `/media` route for easy frontend access
- JWT-based authentication and protected routes were added to enforce role-based access
- SMTP settings were made configurable through the admin dashboard so alerts could be enabled without code changes
- both field uploads and CCTV detections were logged with frame path, timestamp, and source information for later review

---

# 4. RESULTS AND DISCUSSION

The implemented prototype demonstrates that a web-based AI surveillance support platform can successfully integrate registration, matching, CCTV analysis, and officer alerting in one system. The frontend provides separate dashboards for administrators and officers, while the backend performs image handling, record management, and match computation.

## 4.1 Testing, Test Cases and Test Results

The guidelines require each test case to include description, input, expected output, and pass/fail criteria. The following table can be used directly in your report. Replace the "Observed Result" column with your final verified output during demo/testing.

| Test Case ID | Description | Input | Expected Output | Pass/Fail Criteria | Observed Result |
|---|---|---|---|---|---|
| TC01 | Admin login | Valid admin username and password | Admin dashboard opens | Token generated and admin routes accessible | [Insert result] |
| TC02 | Officer login | Valid officer username and password | Officer dashboard opens | Token generated and officer routes accessible | [Insert result] |
| TC03 | Add criminal record | Criminal details + valid face image | Record stored successfully | Criminal appears in list and image saved | [Insert result] |
| TC04 | Add missing-person record | Missing-person details + valid face image | Record stored successfully | Record appears in missing-person list | [Insert result] |
| TC05 | Reject image without detectable face | Blurred or invalid image | Error shown | System must not save record | [Insert result] |
| TC06 | Suspect image match | Image of enrolled criminal | Match returned with confidence score | Returned person ID matches enrolled subject | [Insert result] |
| TC07 | Missing-person image match | Image of enrolled missing person | Match returned with confidence score | Returned person ID matches enrolled subject | [Insert result] |
| TC08 | CCTV upload and scan | CCTV video containing enrolled face | Matching frames saved with timestamps | At least one valid detection frame stored | [Insert result] |
| TC09 | Search criminal by name | Partial name query | Matching records shown | Search returns relevant criminal records | [Insert result] |
| TC10 | Email alert dispatch | Match event with SMTP configured | Alert email sent to officers | Officer mailbox receives formatted alert | [Insert result] |

### Test Report Summary

The major functional flows of IDENTIX were designed for positive-path and negative-path validation. Positive-path testing verifies that authenticated users can register records, run matches, and upload CCTV footage. Negative-path testing verifies that the system rejects invalid credentials, images without visible faces, and unauthorized access to protected routes.

You may present the final compiled test report in the following format:

- Total number of test cases executed: **10**
- Number of test cases passed: **[Insert value]**
- Number of test cases failed: **[Insert value]**
- Percentage passed: **[Insert percentage]**

Formula:

```text
Percentage Passed = (Number of Passed Test Cases / Total Test Cases) x 100
```

## 4.2 Results / Performance Evaluation / Screenshots

The prototype produced the following functional outcomes:

- successful creation and storage of criminal and missing-person records
- secure role-based dashboards for admin and officer workflows
- image-based suspect matching against the criminal database
- image-based missing-person matching against the missing-person database
- video-based scan results with extracted evidence frames
- timestamped CCTV detections stored in the database
- email alert support for match notification

### Performance Discussion

The system performs well for small to moderate institutional datasets because it uses precomputed embeddings for enrolled persons and compares new embeddings only at runtime. This reduces computational overhead compared to training or reprocessing the complete dataset repeatedly.

The CCTV module balances speed and accuracy through frame skipping. Instead of processing every frame, the system samples frames based on a configurable stride. This reduces total scan time while still capturing likely appearances in surveillance footage.

The main performance bottlenecks are:

- poor input image quality
- occlusion and side-face orientation
- large video length and high frame count
- growth in the number of enrolled records

### Screenshots to Insert

Add the following screenshots in the final report:

- Login page
- Admin dashboard
- Criminal database page
- Missing-person management page
- CCTV upload page
- Suspect match result page
- Missing-person match result page
- Criminal search page
- Email settings page
- Sample alert email

Use figure numbers such as:

- Figure 4.1 Login Interface
- Figure 4.2 Admin Dashboard
- Figure 4.3 Criminal Registration Form
- Figure 4.4 CCTV Detection Result

## 4.3 Results Comparison

The following comparison summarizes how the proposed system improves over manual or fragmented workflows:

| Parameter | Existing Approach | Proposed IDENTIX System |
|---|---|---|
| Criminal search | Manual or isolated record lookup | Centralized searchable database |
| Missing-person tracing | Separate manual coordination | Integrated facial matching and record tracking |
| CCTV review | Human inspection of long footage | Automated frame sampling and face matching |
| Alert mechanism | Phone calls / manual reporting | Structured email alerts with evidence |
| Evidence storage | Non-uniform | Timestamped digital frame logging |
| User access | Not role-controlled | JWT based role-specific access |
| Scalability | Limited | Expandable through modular services |

Compared with high-end research models discussed in the literature, IDENTIX currently favors practical deployability over maximum benchmark accuracy. It uses a lightweight pipeline that is easier to implement in a student project while still demonstrating a complete operational workflow. This makes the system suitable as a proof-of-concept and a strong foundation for future deep-model upgrades.

---

# 5. CONCLUSION AND FUTURE SCOPE

## 5.1 Conclusion

IDENTIX successfully demonstrates the design and implementation of an intelligent surveillance and identification platform for criminal detection and missing-person assistance. The project integrates computer vision, database management, secure access control, and a modern web interface into a single full-stack application. It supports record enrollment, image-based matching, CCTV-based search, timestamped result storage, and officer notification.

The system addresses several practical limitations of traditional surveillance workflows, especially the delay and inefficiency associated with manual record checking and manual CCTV review. By using facial embeddings and automated comparison, IDENTIX reduces human effort while improving traceability and consistency of detection records.

From an academic perspective, the project validates the feasibility of combining AI-assisted recognition with real-world web application design. The project also demonstrates how modular backend services and a role-based frontend can be organized into a maintainable software architecture.

## 5.2 Future Enhancements

The future scope of the project is significant. The following enhancements can further improve the system:

- replace Haar Cascade with advanced face detectors such as RetinaFace or MTCNN
- integrate ArcFace or similar high-accuracy embedding models
- support real-time live camera stream analysis
- add geographic tagging and map-based incident visualization
- include audit reports and PDF export generation
- add mobile support for field officers
- implement image quality scoring before matching
- add multi-camera search and alert prioritization
- support multilingual interfaces
- introduce encrypted media storage and stronger compliance features

---

# 6. APPENDIX

## 6.1 Source Code

In the final report, include selected source code excerpts covering approximately 10-12 pages as per the guideline. Recommended files from this project are:

- `backend/app/main.py`
- `backend/app/auth.py`
- `backend/app/routes/admin.py`
- `backend/app/routes/officer.py`
- `backend/app/services/face.py`
- `backend/app/services/video.py`
- `backend/app/services/email.py`
- `frontend/src/App.jsx`
- `frontend/src/services/api.js`
- selected frontend pages such as `UploadCCTV.jsx`, `SuspectMatch.jsx`, and `MissingMatch.jsx`

Suggested appendix note:

The complete source code of the project consists of frontend and backend modules. The backend exposes REST APIs, performs embedding-based comparison, and stores records in MongoDB. The frontend consumes these APIs and renders dashboards for police-oriented workflows.

## 6.2 Screenshots

Insert all important screenshots here again in appendix format if your department expects a separate screenshot section. Suggested items:

- login
- admin dashboard
- officer dashboard
- criminal record form
- missing-person record form
- CCTV upload and analysis results
- suspect match results
- missing match results
- criminal search results
- email alert preview

## 6.3 List of Abbreviations

| Abbreviation | Expansion |
|---|---|
| AI | Artificial Intelligence |
| API | Application Programming Interface |
| CCTV | Closed Circuit Television |
| JWT | JSON Web Token |
| UI | User Interface |
| DB | Database |
| SMTP | Simple Mail Transfer Protocol |
| RGB | Red Green Blue |
| UML | Unified Modeling Language |
| LFW | Labeled Faces in the Wild |
| YTF | YouTube Faces |

---

# 7. REFERENCES

Use IEEE style and keep the order consistent with Chapter 2 citations.

[1] Y. Taigman, M. Yang, M. A. Ranzato, and L. Wolf, "DeepFace: Closing the Gap to Human-Level Performance in Face Verification," in *Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR)*, 2014, pp. 1701-1708. Available: https://openaccess.thecvf.com/content_cvpr_2014/html/Taigman_DeepFace_Closing_the_2014_CVPR_paper.html

[2] F. Schroff, D. Kalenichenko, and J. Philbin, "FaceNet: A Unified Embedding for Face Recognition and Clustering," in *Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR)*, 2015, pp. 815-823. Available: https://openaccess.thecvf.com/content_cvpr_2015/html/Schroff_FaceNet_A_Unified_2015_CVPR_paper.html

[3] K. Zhang, Z. Zhang, Z. Li, and Y. Qiao, "Joint Face Detection and Alignment Using Multi-task Cascaded Convolutional Networks," *arXiv preprint arXiv:1604.02878*, 2016. Available: https://arxiv.org/abs/1604.02878

[4] H. Wang, Y. Wang, Z. Zhou, X. Ji, D. Gong, J. Zhou, Z. Li, and W. Liu, "CosFace: Large Margin Cosine Loss for Deep Face Recognition," in *Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR)*, 2018, pp. 5265-5274. Available: https://openaccess.thecvf.com/content_cvpr_2018/html/Wang_CosFace_Large_Margin_CVPR_2018_paper.html

[5] J. Deng, J. Guo, E. Ververas, I. Kotsia, and S. Zafeiriou, "RetinaFace: Single-Shot Multi-Level Face Localisation in the Wild," in *Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)*, 2020, pp. 5203-5212. Available: https://openaccess.thecvf.com/content_CVPR_2020/html/Deng_RetinaFace_Single-Shot_Multi-Level_Face_Localisation_in_the_Wild_CVPR_2020_paper.html

Additional implementation reference:

[6] IDENTIX Project Repository, local project implementation consisting of React frontend and FastAPI backend, accessed March 23, 2026.

---

## Final Formatting Checklist

Before submission, convert this content into your final report document with the following rules from the guideline PDF:

- Font: Times New Roman
- Main title: 14 bold
- Subtitle: 12 bold
- Body text: 12
- Line spacing: 1.5
- Total pages: 50-60 pages
- Each main chapter should ideally cover at least 7 pages, especially early chapters
- Add page border on each page
- Header top right: Project title
- Footer bottom left: Federal Institute of Science and Technology (FISAT) (R)
- Footer bottom right: Page number
- Add at least 5 literature references in Chapter 2
- Ensure Chapter 2 reference numbering matches the final reference list

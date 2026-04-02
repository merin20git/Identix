from __future__ import annotations

import os
from dataclasses import dataclass

import cv2
import numpy as np

from app.core.config import settings
from app.services.face import compare_embeddings, haar_face_locations, similarity_from_distance
import face_recognition


@dataclass
class KnownPerson:
    person_id: str
    name: str
    embedding: np.ndarray


@dataclass
class FrameMatch:
    person_id: str
    person_name: str
    similarity: float
    frame_path: str
    timestamp_ms: int


def scan_video_for_matches(
    video_path: str,
    known_people: list[KnownPerson],
    stride: int | None = None,
    threshold: float | None = None,
) -> list[FrameMatch]:
    if not known_people:
        return []
    stride = stride or settings.frame_stride
    threshold = threshold or settings.match_threshold

    matches: list[FrameMatch] = []
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return matches

    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
    frame_idx = 0

    while True:
        ok, frame = cap.read()
        if not ok:
            break
        if frame_idx % stride != 0:
            frame_idx += 1
            continue

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        locations = haar_face_locations(rgb)
        if not locations:
            frame_idx += 1
            continue
        encodings = face_recognition.face_encodings(rgb, locations)
        if not encodings:
            frame_idx += 1
            continue

        for i, encoding in enumerate(encodings):
            best_idx, distance = compare_embeddings(encoding, [p.embedding for p in known_people])
            if best_idx is None or distance is None:
                continue
            if distance <= threshold:
                person = known_people[best_idx]
                similarity = similarity_from_distance(distance)
                timestamp_ms = int((frame_idx / fps) * 1000)
                safe_id = person.person_id.replace(":", "_").replace(" ", "_")
                filename = f"match_{safe_id}_{frame_idx}.jpg"
                frame_path = os.path.join(settings.frames_dir, filename)

                # Draw green frame around detected face
                top, right, bottom, left = locations[i]
                # BGR color for green is (0, 255, 0)
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
                
                # Optional: Add name label
                cv2.putText(frame, person.name, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

                print("Saving frame to:", frame_path)

                # ensure frames directory exists
                os.makedirs(settings.frames_dir, exist_ok=True)

                cv2.imwrite(frame_path, frame)
                matches.append(
                    FrameMatch(
                        person_id=person.person_id,
                        person_name=person.name,
                        similarity=similarity,
                        frame_path=frame_path,
                        timestamp_ms=timestamp_ms,
                    )
                )
        frame_idx += 1

    cap.release()
    return matches

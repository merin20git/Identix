from __future__ import annotations

import io
from typing import Iterable

import cv2
import face_recognition
import numpy as np
from PIL import Image


def load_image_bytes(data: bytes) -> np.ndarray:
    image = Image.open(io.BytesIO(data)).convert("RGB")
    return np.array(image)


def haar_face_locations(rgb_image: np.ndarray) -> list[tuple[int, int, int, int]]:
    gray = cv2.cvtColor(rgb_image, cv2.COLOR_RGB2GRAY)
    cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces = cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
    locations: list[tuple[int, int, int, int]] = []
    for (x, y, w, h) in faces:
        top = y
        right = x + w
        bottom = y + h
        left = x
        locations.append((top, right, bottom, left))
    return locations


def largest_face_index(locations: list[tuple[int, int, int, int]]) -> int | None:
    if not locations:
        return None
    areas = [abs((b - t) * (r - l)) for (t, r, b, l) in locations]
    return int(np.argmax(areas))


def encode_single_face(rgb_image: np.ndarray) -> np.ndarray | None:
    locations = haar_face_locations(rgb_image)
    idx = largest_face_index(locations)
    if idx is None:
        return None
    encodings = face_recognition.face_encodings(rgb_image, [locations[idx]])
    if not encodings:
        return None
    return encodings[0]


def encode_faces(rgb_image: np.ndarray) -> list[np.ndarray]:
    locations = haar_face_locations(rgb_image)
    if not locations:
        return []
    return face_recognition.face_encodings(rgb_image, locations)


def compare_embeddings(
    probe: np.ndarray,
    known: Iterable[np.ndarray],
) -> tuple[int | None, float | None]:
    known_list = list(known)
    if not known_list:
        return None, None
    distances = face_recognition.face_distance(known_list, probe)
    best_idx = int(np.argmin(distances))
    return best_idx, float(distances[best_idx])


def similarity_from_distance(distance: float) -> float:
    score = 1.0 - distance
    if score < 0:
        return 0.0
    if score > 1:
        return 1.0
    return score

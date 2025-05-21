# Don't Fret It!

**Don't Fret It** is a sleek web app that identifies musical notes (A-G + rest) in uploaded sheet music images.

<img src="https://github.com/user-attachments/assets/34c84eb9-1e82-4d01-a374-70df1224b934" width="100"/>

---

## 🧠 Roboflow Model

- Trained a custom model using **Roboflow** on a labeled sheet music dataset.
- Dataset includes varied note positions and types across multiple samples.
- Detects and classifies **8 classes**: A, B, C, D, E, F, G, and rest.
- Model accessible via **Roboflow API**.
- Link to model and dataset on Roboflow: https://app.roboflow.com/vishwaks-workspace/note-detector-fdrwc/models

---

## Backend

- Built using **FastAPI**.
- `/predict` endpoint accepts uploaded sheet music images.
- Sends images to Roboflow for detection.
- Applies **Non-Max Suppression** to reduce overlapping boxes.
- Uses **PIL** to draw labeled note letters (A-G) above each detected note.
- Returns annotated image to frontend.

---

## Frontend

Developed in **React**, the UI has a simple and elegant 3-step flow:

1. **UploadStep** – Drag-and-drop image selection.
2. **ResultStep** – Displays annotated output with a download option.
3. **ResetButton** – Resets the app to allow new uploads.

- Clean, responsive styling with custom CSS.
- Focused on user simplicity and fast feedback.

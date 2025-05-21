# backend/main.py

import io
from pathlib import Path

import requests
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from PIL import Image, ImageDraw, ImageFont

app = FastAPI()

# ─── ROBOFLOW CONFIG ─────────────────────────────────────────────────────────────
API_KEY       = "KCjesbztXiIfDe1rc1k1"
MODEL_SLUG    = "note-detector-fdrwc"
MODEL_VERSION = 4
DETECT_URL    = f"https://detect.roboflow.com/{MODEL_SLUG}/{MODEL_VERSION}"

# ─── PATHS ────────────────────────────────────────────────────────────────────────
BASE_DIR   = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "static" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# ─── CLASS INDEX → NOTE LETTER ────────────────────────────────────────────────────
CLASS_MAP = {
    "0": "rest",
    "1": "A",
    "2": "B",
    "3": "C",
    "4": "D",
    "5": "E",
    "6": "F",
    "7": "G",
}

# ─── NON-MAX SUPPRESSION ──────────────────────────────────────────────────────────
def iou(a, b):
    xa1 = a["x"] - a["width"]/2
    ya1 = a["y"] - a["height"]/2
    xa2 = xa1 + a["width"]
    ya2 = ya1 + a["height"]
    xb1 = b["x"] - b["width"]/2
    yb1 = b["y"] - b["height"]/2
    xb2 = xb1 + b["width"]
    yb2 = yb1 + b["height"]
    xi1 = max(xa1, xb1)
    yi1 = max(ya1, yb1)
    xi2 = min(xa2, xb2)
    yi2 = min(ya2, yb2)
    inter = max(0, xi2-xi1) * max(0, yi2-yi1)
    area_a = (xa2-xa1)*(ya2-ya1)
    area_b = (xb2-xb1)*(yb2-yb1)
    return inter/(area_a + area_b - inter + 1e-8)

def nms(preds, iou_thresh=0.5):
    keep = []
    for p in sorted(preds, key=lambda x: x["confidence"], reverse=True):
        if all(iou(p, q) < iou_thresh for q in keep):
            keep.append(p)
    return keep

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # 1) Validate upload
    if not file.filename.lower().endswith((".png", ".jpg", ".jpeg")):
        raise HTTPException(400, "Only .png/.jpg/.jpeg images allowed")
    data = await file.read()
    upload_path = UPLOAD_DIR / file.filename
    upload_path.write_bytes(data)

    # 2) Inference → JSON
    try:
        with open(upload_path, "rb") as fh:
            resp = requests.post(
                DETECT_URL,
                params={
                    "api_key":    API_KEY,
                    "format":     "json",
                    "confidence": 0.6  # drop any <60% confidence
                },
                files={"file": fh}
            )
            resp.raise_for_status()
            preds = resp.json().get("predictions", [])
    except Exception as e:
        raise HTTPException(502, f"Roboflow API error: {e}")

    # 3) Dedupe with NMS
    preds = nms(preds, iou_thresh=0.5)

    # 4) Draw only your letters atop the ORIGINAL image
    img = Image.open(io.BytesIO(data)).convert("RGB")
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("/Library/Fonts/Times New Roman.ttf", 20)
    except:
        font = ImageFont.load_default()

    for p in preds:
        cls_idx = str(p["class"])
        letter  = CLASS_MAP.get(cls_idx, "?")

        # calculate top of box
        box_top = p["y"] - p["height"]/2
        # measure letter size
        bbox = draw.textbbox((0, 0), letter, font=font)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]

        # center above note
        x = p["x"] - tw/2
        y = box_top - th - 4

        draw.text((x, y), letter, fill="black", font=font)

    # 5) Return annotated image
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/jpeg")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
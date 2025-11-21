# AuthentiChip Integration Guide

Complete guide for integrating Frontend, Backend, ML Model, and Hardware (Raspberry Pi HQ Camera).

## System Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  Frontend   │─────▶│   Backend   │─────▶│  Hardware   │      │  ML Model   │
│   (React)   │◀─────│  (FastAPI)  │◀─────│ (Raspberry  │◀─────│  (PyTorch)  │
│             │      │             │      │     Pi)     │      │             │
└─────────────┘      └─────────────┘      └─────────────┘      └─────────────┘
```

## Data Flow

1. **User clicks "SCAN IC"** → Frontend sends POST to `/api/scan/trigger`
2. **Backend receives trigger** → Sends command to Raspberry Pi to capture image
3. **Hardware captures** → Raspberry Pi HQ camera takes photo, saves to storage
4. **Image sent to Backend** → Pi sends image to Backend via HTTP/WebSocket
5. **Backend processes** → Sends image to ML Model for analysis
6. **ML Model analyzes** → Runs Branch A (Physical) + Branch B (OCR/Datasheet/Layout)
7. **Response to Backend** → ML returns JSON with full analysis
8. **Backend to Frontend** → Returns complete response to Frontend
9. **Frontend displays** → Shows Overall Status, Branch A, Branch B, Traceability

---

## Backend API Endpoints (FastAPI)

### 1. Trigger Scan Endpoint

**Endpoint:** `POST /api/scan/trigger`

**Description:** Triggers hardware camera to capture image and processes it through ML model.

**Request:**
```json
{}
```

**Response:**
```json
{
  "overall_status": "GENUINE" | "FAKE" | "REVIEW_NEEDED",
  "overall_confidence_score": 0.93,
  "primary_failure_reason": "Texture inconsistency (possible blacktopping)" | null,
  
  "branch_a": {
    "result": "PASS" | "FAIL",
    "autoencoder_anomaly_score": 0.18,
    "anomaly_threshold": 0.25,
    "texture_anomaly": {
      "number_of_anomalous_regions": 0,
      "max_entropy_patch": 0.45
    },
    "physical_flags": {
      "possible_resurfacing": false,
      "non_uniform_texture": false
    },
    "preprocessed_image_url": "http://backend:8000/images/registered_abc123.jpg"
  },
  
  "branch_b": {
    "overall_result": "PASS" | "FAIL",
    "ocr_verification": {
      "extracted_fields": {
        "part_number": "SN74HC273N",
        "manufacturer": "TI",
        "lot_code": "A23B"
      },
      "text_match_result": {
        "part_number_match": "MATCH" | "MISMATCH",
        "manufacturer_match": "MATCH" | "MISMATCH",
        "lot_date_format": "VALID" | "INVALID" | "NOT_AVAILABLE"
      },
      "ocr_confidence": 0.92
    },
    "datasheet_verification": {
      "datasheet_status": "FOUND" | "NOT_FOUND" | "MULTIPLE_CANDIDATES",
      "oem_source_info": {
        "oem_name": "Texas Instruments",
        "datasheet_title": "SN74HC273 Octal D-Type Flip-Flop",
        "version": "Rev. D",
        "source_url": "https://www.ti.com/lit/ds/symlink/sn74hc273.pdf"
      },
      "marking_rule_summary": {
        "expected_package_type": "DIP-20",
        "expected_top_marking": "SN74HC273N"
      },
      "rule_parsing_status": "SUCCESS" | "PARTIAL" | "FAILED"
    },
    "layout_verification": {
      "layout_check_result": "PASS" | "FAIL" | "NOT_AVAILABLE",
      "position_deviation": {
        "logo_deviation": 1.8,
        "text_block_deviation": 3.2
      },
      "layout_flags": {
        "text_misaligned": false,
        "logo_missing": false,
        "extra_unknown_marking": false
      }
    }
  },
  
  "traceability": {
    "inspection_id": "INSP-20251121-173212-001",
    "timestamp": "2025-11-21T17:32:12Z",
    "station_id": "STATION-001",
    "image_references": {
      "captured_image_id": "IMG-abc123",
      "registered_image_id": "REG-abc123",
      "anomaly_heatmap_id": "HEAT-abc123"
    },
    "rule_source_reference": {
      "rule_id": "RULE-SN74HC273N-001"
    },
    "operator_override": {
      "override_status": "NONE" | "OVERRIDDEN_TO_GENUINE" | "OVERRIDDEN_TO_FAKE",
      "operator_comments": ""
    }
  },
  
  "captured_image_url": "http://backend:8000/images/captured_abc123.jpg"
}
```

**Backend Implementation Example (Python/FastAPI):**

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import uuid
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Raspberry Pi endpoint
RASPBERRY_PI_URL = "http://raspberry-pi-ip:5000"

@app.post("/api/scan/trigger")
async def trigger_scan():
    try:
        # 1. Trigger hardware to capture
        async with httpx.AsyncClient() as client:
            # Send capture command to Raspberry Pi
            pi_response = await client.post(
                f"{RASPBERRY_PI_URL}/capture",
                timeout=10.0
            )
            image_data = pi_response.content
            image_id = str(uuid.uuid4())
            
            # Save image
            image_path = f"/storage/images/captured_{image_id}.jpg"
            with open(image_path, "wb") as f:
                f.write(image_data)
        
        # 2. Send to ML Model
        async with httpx.AsyncClient() as client:
            ml_response = await client.post(
                "http://ml-model-service:8001/analyze",
                files={"image": image_data},
                timeout=30.0
            )
            ml_result = ml_response.json()
        
        # 3. Combine results
        result = {
            **ml_result,
            "captured_image_url": f"http://backend:8000/images/captured_{image_id}.jpg",
            "traceability": {
                **ml_result.get("traceability", {}),
                "inspection_id": f"INSP-{datetime.now().strftime('%Y%m%d-%H%M%S')}-{image_id[:8]}",
                "timestamp": datetime.now().isoformat(),
            }
        }
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

## Hardware Integration (Raspberry Pi)

### Raspberry Pi Setup

**Required Hardware:**
- Raspberry Pi 4 (or newer)
- Raspberry Pi HQ Camera Module
- Relay module (for flash trigger, optional)

**Required Software:**
- Python 3.9+
- `picamera2` library
- Flask/FastAPI for HTTP server

### Raspberry Pi Endpoint

**Endpoint:** `POST /capture`

**Description:** Captures image from HQ camera and returns image data.

**Python Implementation:**

```python
from flask import Flask, send_file
from picamera2 import Picamera2
import io
import time

app = Flask(__name__)
picam2 = Picamera2()

# Configure camera
config = picam2.create_still_configuration(main={"size": (4056, 3040)})
picam2.configure(config)
picam2.start()

@app.route('/capture', methods=['POST'])
def capture_image():
    try:
        # Optional: Trigger flash relay
        # GPIO.output(FLASH_PIN, GPIO.HIGH)
        # time.sleep(0.1)
        
        # Capture image
        image_array = picam2.capture_array()
        
        # Optional: Turn off flash
        # GPIO.output(FLASH_PIN, GPIO.LOW)
        
        # Convert to JPEG
        from PIL import Image
        img = Image.fromarray(image_array)
        img_io = io.BytesIO()
        img.save(img_io, 'JPEG', quality=95)
        img_io.seek(0)
        
        return send_file(img_io, mimetype='image/jpeg')
        
    except Exception as e:
        return {"error": str(e)}, 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

### Video Stream Setup (MJPEG)

For live video feed in frontend:

```python
from flask import Response
import cv2

def generate_frames():
    while True:
        frame = picam2.capture_array()
        # Convert to JPEG
        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/video/stream')
def video_stream():
    return Response(
        generate_frames(),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )
```

**Frontend Integration:**
- Update `VITE_API_BASE_URL` to point to your backend
- Backend should proxy video stream: `/api/video/stream` → Raspberry Pi `/video/stream`

---

## ML Model Integration

### ML Model Service

**Endpoint:** `POST /analyze`

**Input:** Multipart form data with image file

**Output:** JSON response matching the structure above

**Python Implementation Example:**

```python
from fastapi import FastAPI, File, UploadFile
import torch
from PIL import Image
import io

app = FastAPI()

# Load models
autoencoder = torch.load('models/autoencoder.pth')
ocr_model = torch.load('models/ocr_model.pth')

@app.post("/analyze")
async def analyze_ic(image: UploadFile = File(...)):
    # Read image
    image_data = await image.read()
    img = Image.open(io.BytesIO(image_data))
    
    # Branch A: Physical Integrity
    branch_a_result = run_branch_a(img)
    
    # Branch B: OCR & Datasheet
    branch_b_result = run_branch_b(img)
    
    # Determine overall status
    overall_status = determine_status(branch_a_result, branch_b_result)
    
    return {
        "overall_status": overall_status,
        "overall_confidence_score": calculate_confidence(branch_a_result, branch_b_result),
        "primary_failure_reason": get_failure_reason(branch_a_result, branch_b_result),
        "branch_a": branch_a_result,
        "branch_b": branch_b_result,
        "traceability": {
            "image_references": {
                "captured_image_id": save_image(img, "captured"),
                "registered_image_id": save_image(registered_img, "registered"),
            }
        }
    }
```

---

## Frontend Configuration

### Environment Variables

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000
```

For production:
```env
VITE_API_BASE_URL=http://your-backend-server:8000
```

### API Integration Points

1. **Scan Trigger:** `src/utils/api.js` → `triggerScan()`
2. **Video Stream:** `src/components/LiveVideoFeed.jsx` → Uses `getVideoStreamUrl()`
3. **Response Handling:** `src/pages/InspectionView.jsx` → Handles full ML response

---

## Testing Without Hardware

### Demo Mode

The frontend includes a **Demo Mode** toggle that simulates the full response structure without requiring hardware or ML model.

1. Toggle "Demo Mode" in top-right corner
2. Click "SCAN IC"
3. See full response with Branch A, Branch B, and Traceability

### Mock Backend for Development

Create a simple mock backend:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/scan/trigger")
async def mock_scan():
    is_genuine = random.random() > 0.3
    return {
        "overall_status": "GENUINE" if is_genuine else "FAKE",
        "overall_confidence_score": 0.95 if is_genuine else 0.87,
        "primary_failure_reason": None if is_genuine else "Texture anomaly detected",
        # ... full structure from above
    }
```

---

## Deployment Checklist

### Frontend
- [ ] Set `VITE_API_BASE_URL` in production `.env`
- [ ] Build: `npm run build`
- [ ] Serve with nginx/apache or deploy to Vercel/Netlify

### Backend
- [ ] Configure CORS for frontend domain
- [ ] Set Raspberry Pi IP/URL
- [ ] Set ML Model service URL
- [ ] Configure image storage (MinIO/S3/local)
- [ ] Set up MongoDB for traceability storage

### Hardware
- [ ] Raspberry Pi accessible on network
- [ ] Camera module working
- [ ] Flash relay connected (if using)
- [ ] Network connectivity to backend

### ML Model
- [ ] Model service running and accessible
- [ ] Models loaded and ready
- [ ] Datasheet scraping service configured

---

## File Structure Summary

### Frontend Files Created/Updated

```
frontend/
├── src/
│   ├── components/
│   │   ├── BranchACard.jsx          # Physical integrity display
│   │   ├── BranchBCard.jsx           # OCR/Datasheet/Layout display
│   │   ├── TraceabilityCard.jsx      # Session info display
│   │   ├── OverallStatusCard.jsx     # Main status card
│   │   ├── LiveVideoFeed.jsx         # Raspberry Pi video stream
│   │   ├── Sidebar.jsx
│   │   ├── ScanButton.jsx
│   │   └── ProcessingLoader.jsx
│   ├── pages/
│   │   ├── InspectionView.jsx        # Main inspection interface
│   │   ├── GalleryView.jsx
│   │   └── ReportView.jsx
│   ├── store/
│   │   └── useAppStore.js            # Zustand state management
│   └── utils/
│       └── api.js                    # API client functions
└── INTEGRATION_GUIDE.md             # This file
```

---

## Troubleshooting

### Frontend can't connect to backend
- Check `VITE_API_BASE_URL` is correct
- Verify backend CORS settings
- Check network connectivity

### Video stream not loading
- Verify Raspberry Pi is streaming on correct endpoint
- Check backend proxy configuration
- Test stream URL directly in browser

### Scan returns error
- Check backend logs
- Verify Raspberry Pi is accessible
- Check ML model service is running
- Verify image storage is writable

---

## Next Steps

1. **Backend Implementation:** Implement FastAPI endpoints matching the structure above
2. **Hardware Setup:** Configure Raspberry Pi with camera and relay
3. **ML Model Integration:** Connect your PyTorch models to the service
4. **Testing:** Use Demo Mode first, then test with real hardware
5. **Deployment:** Deploy all components to production environment

For questions or issues, refer to the code comments in each component file.


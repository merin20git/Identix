"""
IDENTIX – Rich HTML Email Alert Service
Sends a premium alert email to all registered officers the moment a face match
is detected from CCTV footage or field identification.
"""

from __future__ import annotations

import asyncio
import os
import smtplib
import uuid
from datetime import datetime, timezone
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional

from app.core.config import settings


# ──────────────────────────────────────────────────────────────────────────────
# Build rich HTML body
# ──────────────────────────────────────────────────────────────────────────────
def _build_html(
    person_name: str,
    match_type: str,
    confidence: float,
    crime: Optional[str],
    last_known_location: Optional[str],
    national_id: Optional[str],
    dob: Optional[str],
    detections: list,
    alert_timestamp: str,
    profile_cid: Optional[str],
) -> str:
    conf_pct = confidence * 100
    conf_color = "#16a34a" if conf_pct >= 80 else "#d97706" if conf_pct >= 60 else "#dc2626"

    # ── Detection rows ──────────────────────────────────────────────
    detection_rows = ""
    for i, d in enumerate(detections[:5]):
        ts_ms = d.get("timestamp_ms", 0)
        ts_s = ts_ms / 1000.0
        frame_cid = d.get("cid", None)

        if frame_cid:
            frame_img_tag = f"""
            <img src="cid:{frame_cid}"
                 alt="Detection Frame {i+1}"
                 style="width:100%;max-width:260px;height:160px;object-fit:cover;
                        border-radius:10px;border:1px solid #e2e8f0;display:block;margin:0 auto 6px auto;" />
            """
        else:
            frame_img_tag = """
            <div style="width:100%;max-width:260px;height:160px;background:#f1f5f9;border-radius:10px;
                        display:flex;align-items:center;justify-content:center;margin:0 auto 6px auto;
                        color:#94a3b8;font-size:12px;border:1px solid #e2e8f0;">No Frame Available</div>
            """

        video_label = d.get("video_path", "")
        has_video = bool(video_label)
        video_label = os.path.basename(video_label) if has_video else "Field Assessment"
        label_prefix = "Frame" if has_video else "Image"
        detected_at = d.get("created_at", "")
        if detected_at and hasattr(detected_at, "strftime"):
            detected_at = detected_at.strftime("%d %b %Y, %H:%M:%S UTC")

        detection_rows += f"""
        <td style="padding:12px;vertical-align:top;width:33%;">
          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:12px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
            {frame_img_tag}
            <p style="margin:8px 0 2px;color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">
              {label_prefix} #{i+1}
            </p>
            <p style="margin:2px 0;color:#0ea5e9;font-size:14px;font-weight:800;">
              ⏱ {ts_s:.2f}s
            </p>
            <p style="margin:4px 0 2px;color:#475569;font-size:11px;font-weight:500;">{video_label}</p>
            {f'<p style="margin:0;color:#94a3b8;font-size:10px;">{detected_at}</p>' if detected_at else ''}
          </div>
        </td>
        """

    if detection_rows:
        has_any_video = any(d.get("video_path") for d in detections)
        heading_icon = "📽" if has_any_video else "📸"
        heading_text = "CCTV Detection Frames" if has_any_video else "Uploaded Identification Image"
        
        frames_section = f"""
        <tr><td colspan="2" style="padding:0 32px 32px;">
          <p style="color:#64748b;font-size:12px;font-weight:800;text-transform:uppercase;
                    letter-spacing:1px;margin:0 0 16px;">{heading_icon} {heading_text}</p>
          <table cellpadding="0" cellspacing="0" width="100%"><tr>{detection_rows}</tr></table>
        </td></tr>
        """
    else:
        frames_section = ""

    # ── Profile photo ───────────────────────────────────────────────
    if profile_cid:
        profile_tag = f"""
        <img src="cid:{profile_cid}"
             alt="{person_name}"
             style="width:130px;height:130px;object-fit:cover;border-radius:50%;
                    border:4px solid #ffffff;box-shadow:0 4px 10px rgba(0,0,0,0.1);display:block;margin:0 auto 12px auto;" />
        """
    else:
        profile_tag = """
        <div style="width:130px;height:130px;background:#f8fafc;border-radius:50%;
                    border:4px solid #ffffff;box-shadow:0 4px 10px rgba(0,0,0,0.1);display:flex;align-items:center;
                    justify-content:center;margin:0 auto 12px auto;
                    color:#94a3b8;font-size:36px;">👤</div>
        """

    # ── Field rows helper ───────────────────────────────────────────
    def field(label: str, value: Optional[str], color: str = "#334155") -> str:
        if not value:
            return ""
        return f"""
        <tr>
          <td style="padding:10px 16px;font-size:12px;font-weight:700;color:#64748b;
                     text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap;border-bottom:1px solid #f1f5f9;">{label}</td>
          <td style="padding:10px 16px;font-size:14px;font-weight:700;color:{color};border-bottom:1px solid #f1f5f9;text-align:right;">{value}</td>
        </tr>
        """

    alert_badge_color = "#b91c1c" if match_type.lower() == "criminal" else "#b45309"
    alert_badge_bg = "#fef2f2" if match_type.lower() == "criminal" else "#fffbeb"
    alert_icon = "🚨" if match_type.lower() == "criminal" else "🔍"

    html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>IDENTIX Security Alert</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

  <!-- Outer wrapper -->
  <table cellpadding="0" cellspacing="0" width="100%" style="background:#f8fafc;padding:40px 16px;">
    <tr><td align="center">
    <table cellpadding="0" cellspacing="0" width="700" style="max-width:700px;background:#ffffff;border-radius:24px;
           overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 20px 40px rgba(0,0,0,0.05);">

      <!-- ── HEADER ── -->
      <tr>
        <td style="background:linear-gradient(135deg,#0ea5e9 0%,#2563eb 100%);
                   padding:40px 32px;text-align:center;">
          <p style="margin:0 0 6px;font-size:12px;font-weight:800;color:#bae6fd;
                    text-transform:uppercase;letter-spacing:4px;">IDENTIX INTELLIGENCE SYSTEM</p>
          <h1 style="margin:0 0 12px;font-size:32px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">
            {alert_icon} MATCH DETECTED
          </h1>
          <div style="display:inline-block;background:{alert_badge_bg};border:1px solid {alert_badge_color}40;
                      color:{alert_badge_color};font-size:13px;font-weight:800;padding:6px 20px;
                      border-radius:999px;text-transform:uppercase;letter-spacing:1px;box-shadow:0 2px 5px rgba(0,0,0,0.1);">
            {match_type} Identification
          </div>
        </td>
      </tr>

      <!-- ── ALERT TIMESTAMP ── -->
      <tr>
        <td colspan="2" style="background:#f1f5f9;padding:12px 32px;border-bottom:1px solid #e2e8f0;text-align:center;">
          <p style="margin:0;font-size:12px;color:#475569;font-weight:500;">
            <span style="color:#0ea5e9;font-weight:800;">🕐 Alert Generated:</span>
            &nbsp;{alert_timestamp}
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <span style="color:#0ea5e9;font-weight:800;">🔒 Classification:</span>
            <span style="font-weight:700;">&nbsp;RESTRICTED – LAW ENFORCEMENT ONLY</span>
          </p>
        </td>
      </tr>

      <!-- ── PROFILE + DETAILS ── -->
      <tr>
        <td style="padding:40px 32px 24px;">
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <!-- Profile photo -->
              <td width="200" style="vertical-align:top;text-align:center;padding-right:32px;">
                {profile_tag}
                <p style="margin:0;font-size:16px;font-weight:900;color:#0f172a;">{person_name}</p>
                <p style="margin:4px 0 0;font-size:11px;font-weight:700;color:#64748b;
                          text-transform:uppercase;letter-spacing:1px;">Identified Subject</p>
              </td>
              <!-- Details -->
              <td style="vertical-align:top;">
                <p style="margin:0 0 12px;font-size:12px;font-weight:800;color:#64748b;
                           text-transform:uppercase;letter-spacing:1px;">Subject Profile Details</p>
                <table cellpadding="0" cellspacing="0" width="100%"
                       style="background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.02);">
                  {field("Full Name", person_name)}
                  {field("Category", match_type, alert_badge_color)}
                  {field("Crime / Case", crime)}
                  {field("Last Location", last_known_location)}
                  {field("National ID", national_id)}
                  {field("Date of Birth", dob)}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- ── CONFIDENCE SCORE ── -->
      <tr>
        <td style="padding:0 32px 32px;">
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:24px;box-shadow:inset 0 2px 4px rgba(0,0,0,0.02);">
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>
                  <p style="margin:0 0 8px;font-size:12px;font-weight:800;color:#64748b;
                             text-transform:uppercase;letter-spacing:1px;">AI Match Confidence Score</p>
                  <div style="background:#e2e8f0;border-radius:999px;height:16px;overflow:hidden;">
                    <div style="height:100%;width:{conf_pct:.1f}%;background:linear-gradient(90deg,{conf_color},{conf_color}dd);
                                border-radius:999px;box-shadow:inset 0 -2px 0 rgba(0,0,0,0.1);"></div>
                  </div>
                </td>
                <td width="90" style="text-align:right;vertical-align:bottom;padding-left:20px;">
                  <span style="font-size:32px;font-weight:900;color:{conf_color};line-height:1;">{conf_pct:.1f}%</span>
                </td>
              </tr>
            </table>
          </div>
        </td>
      </tr>

      <!-- ── DETECTION FRAMES ── -->
      {frames_section}

      <!-- ── ACTION BUTTONS ── -->
      <tr>
        <td style="padding:0 32px 32px;text-align:center;">
          <a href="http://localhost:5173"
             style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;
                    font-size:15px;font-weight:800;padding:16px 32px;border-radius:12px;box-shadow:0 4px 12px rgba(37,99,235,0.3);margin-right:16px;">
            🖥 Open IDENTIX Dashboard
          </a>
          <a href="http://localhost:5173"
             style="display:inline-block;background:#ffffff;color:#475569;text-decoration:none;
                    font-size:15px;font-weight:800;padding:16px 32px;border-radius:12px;
                    border:2px solid #e2e8f0;box-shadow:0 2px 4px rgba(0,0,0,0.02);">
            📋 View Full Dossier
          </a>
        </td>
      </tr>

      <!-- ── WARNING BANNER ── -->
      <tr>
        <td style="background:#fef2f2;border-top:1px solid #fecaca;padding:20px 32px;">
          <p style="margin:0;font-size:13px;color:#b91c1c;font-weight:600;text-align:center;">
            ⚠️ <strong>RESTRICTED INFORMATION</strong> — This alert is intended solely for authorized
            law enforcement personnel. Unauthorized disclosure is strictly prohibited by law.
          </p>
        </td>
      </tr>

      <!-- ── FOOTER ── -->
      <tr>
        <td style="padding:24px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:11px;color:#94a3b8;text-align:center;font-weight:500;">
            IDENTIX Automated Surveillance &amp; Face Recognition System &nbsp;|&nbsp;
            Alert ID: {abs(hash(person_name + alert_timestamp)) % 10**8:08d} &nbsp;|&nbsp;
            System Generated Message
          </p>
        </td>
      </tr>

    </table>
    </td></tr>
  </table>

</body>
</html>
"""
    return html


# ──────────────────────────────────────────────────────────────────────────────
# Low-level sync SMTP sender
# ──────────────────────────────────────────────────────────────────────────────
def _send_email_sync(host: str, port: int, user: str, password: str, msg: MIMEMultipart) -> None:
    with smtplib.SMTP(host, port, timeout=20) as server:
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(user, password)
        server.send_message(msg)


# ──────────────────────────────────────────────────────────────────────────────
# Public API: send_alert_email
# ──────────────────────────────────────────────────────────────────────────────
async def send_alert_email(
    to_email: str,
    person_name: str,
    match_type: str,
    confidence: float,
    detections: list | None = None,
    crime: str | None = None,
    last_known_location: str | None = None,
    national_id: str | None = None,
    dob: str | None = None,
    profile_image_path: str | None = None,
) -> None:
    print(f"[EMAIL] Sending alert to {to_email} – {person_name} ({match_type})")

    if not settings.smtp_user or not settings.smtp_pass:
        print("[EMAIL] SMTP not configured – skipping (set SMTP_USER and SMTP_PASS in .env)")
        return

    alert_ts = datetime.now(timezone.utc).strftime("%d %B %Y, %H:%M:%S UTC")

    # The root email container (related means it contains embedded resources)
    msg_root = MIMEMultipart("related")
    msg_root["From"] = f"IDENTIX Alerts <{settings.smtp_from}>"
    msg_root["To"] = to_email
    msg_root["Subject"] = f"[IDENTIX] {match_type.upper()} IDENTIFIED – {person_name} | Match Confidence {confidence*100:.1f}%"
    msg_root["X-Priority"] = "1"  # high priority flag

    # The alternative container for plain text vs html
    msg_alt = MIMEMultipart("alternative")
    msg_root.attach(msg_alt)

    # Attach Plain-text fallback
    plain = (
        f"IDENTIX SECURITY ALERT\n\n"
        f"A {match_type} match has been detected.\n"
        f"Subject: {person_name}\n"
        f"Confidence: {confidence*100:.1f}%\n"
        f"Crime: {crime or 'N/A'}\n"
        f"Location: {last_known_location or 'N/A'}\n\n"
        f"Detected at: {alert_ts}\n\n"
        f"Open IDENTIX dashboard: http://localhost:5173\n"
    )
    msg_alt.attach(MIMEText(plain, "plain"))

    # Process Images to attach and assign CIDs
    profile_cid = None
    if profile_image_path and os.path.exists(profile_image_path):
        profile_cid = f"profile_{uuid.uuid4().hex}"
        try:
            with open(profile_image_path, "rb") as f:
                img = MIMEImage(f.read())
                img.add_header("Content-ID", f"<{profile_cid}>")
                img.add_header("Content-Disposition", "inline", filename=os.path.basename(profile_image_path))
                msg_root.attach(img)
        except Exception as e:
            print(f"[EMAIL] Failed to attach profile image: {e}")
            profile_cid = None

    processed_detections = []
    if detections:
        for i, d in enumerate(detections[:5]):
            det = d.copy()
            frame_path = det.get("frame_path")
            if frame_path and os.path.exists(frame_path):
                f_cid = f"frame_{uuid.uuid4().hex}"
                try:
                    with open(frame_path, "rb") as f:
                        img = MIMEImage(f.read())
                        img.add_header("Content-ID", f"<{f_cid}>")
                        img.add_header("Content-Disposition", "inline", filename=os.path.basename(frame_path))
                        msg_root.attach(img)
                    det["cid"] = f_cid
                except Exception as e:
                    print(f"[EMAIL] Failed to attach frame image: {e}")
            processed_detections.append(det)

    # Build and Attach HTML
    html_body = _build_html(
        person_name=person_name,
        match_type=match_type,
        confidence=confidence,
        crime=crime,
        last_known_location=last_known_location,
        national_id=national_id,
        dob=dob,
        detections=processed_detections,
        alert_timestamp=alert_ts,
        profile_cid=profile_cid,
    )
    msg_alt.attach(MIMEText(html_body, "html"))

    try:
        loop = asyncio.get_running_loop()
        await loop.run_in_executor(
            None, _send_email_sync,
            settings.smtp_host, settings.smtp_port,
            settings.smtp_user, settings.smtp_pass, msg_root
        )
        print(f"[EMAIL] ✅ Alert sent successfully to {to_email}")
    except Exception as exc:
        print(f"[EMAIL] ❌ Failed sending to {to_email}: {exc}")


# ──────────────────────────────────────────────────────────────────────────────
# Public API: notify_all_officers
# ──────────────────────────────────────────────────────────────────────────────
async def notify_all_officers(
    db,
    person_name: str,
    match_type: str,
    confidence: float,
    detections: list | None = None,
    crime: str | None = None,
    last_known_location: str | None = None,
    national_id: str | None = None,
    dob: str | None = None,
    profile_image_path: str | None = None,
) -> None:
    officers = await db.users.find({"role": "officer"}).to_list(length=100)
    print(f"[EMAIL] Notifying {len(officers)} officer(s) about: {person_name}")

    tasks = []
    for officer in officers:
        email = officer.get("email")
        if email:
            tasks.append(
                send_alert_email(
                    to_email=email,
                    person_name=person_name,
                    match_type=match_type,
                    confidence=confidence,
                    detections=detections,
                    crime=crime,
                    last_known_location=last_known_location,
                    national_id=national_id,
                    dob=dob,
                    profile_image_path=profile_image_path,
                )
            )
        else:
            print(f"[EMAIL] Skipping officer '{officer.get('username')}' – no email registered")

    if tasks:
        await asyncio.gather(*tasks, return_exceptions=True)

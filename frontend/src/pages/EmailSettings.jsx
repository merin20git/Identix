import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { apiRequest } from "../services/api";
import {
  Mail,
  Server,
  Shield,
  Send,
  Save,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
  RefreshCw,
  Lock,
  AtSign,
  Globe,
  Hash,
} from "lucide-react";

const PRESETS = {
  gmail: {
    smtp_host: "smtp.gmail.com",
    smtp_port: 587,
    label: "Gmail",
    hint: "Use an App Password (not your regular Gmail password).",
    helpUrl: "https://support.google.com/accounts/answer/185833",
  },
  outlook: {
    smtp_host: "smtp.office365.com",
    smtp_port: 587,
    label: "Outlook / Office 365",
    hint: "Use your full Microsoft account email and password.",
    helpUrl: "https://support.microsoft.com/en-us/office/pop-imap-and-smtp-settings-8361e398-8af4-4e97-b147-6c6c4ac95353",
  },
  yahoo: {
    smtp_host: "smtp.mail.yahoo.com",
    smtp_port: 587,
    label: "Yahoo Mail",
    hint: "Enable 'Allow apps that use less secure sign in' in Yahoo security settings.",
    helpUrl: "https://help.yahoo.com/kb/SLN4075.html",
  },
};

function StatusBadge({ configured }) {
  return configured ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      SMTP Configured
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">
      <span className="w-2 h-2 rounded-full bg-red-400" />
      Not Configured
    </span>
  );
}

function Field({ label, icon: Icon, id, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-center gap-2 text-xs font-bold text-slate uppercase tracking-widest mb-2"
      >
        <Icon size={13} />
        {label}
      </label>
      {children}
    </div>
  );
}

export default function EmailSettings() {
  const [form, setForm] = useState({
    smtp_host: "smtp.gmail.com",
    smtp_port: 587,
    smtp_user: "",
    smtp_pass: "",
    smtp_from: "",
  });
  const [configured, setConfigured] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [saveMsg, setSaveMsg] = useState(null); // { type: 'success'|'error', text }
  const [testMsg, setTestMsg] = useState(null);
  const [activePreset, setActivePreset] = useState("gmail");

  // ── Load current settings ──────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const data = await apiRequest("/admin/email-settings");
        setForm({
          smtp_host: data.smtp_host || "smtp.gmail.com",
          smtp_port: data.smtp_port || 587,
          smtp_user: data.smtp_user || "",
          smtp_pass: data.smtp_pass || "",
          smtp_from: data.smtp_from || "",
        });
        setTestEmail(data.smtp_user || "");
        setConfigured(data.configured || false);
        // Detect preset
        if (data.smtp_host?.includes("gmail")) setActivePreset("gmail");
        else if (data.smtp_host?.includes("office365") || data.smtp_host?.includes("outlook"))
          setActivePreset("outlook");
        else if (data.smtp_host?.includes("yahoo")) setActivePreset("yahoo");
        else setActivePreset(null);
      } catch {
        /* ignore – may not be saved yet */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handlePreset = (key) => {
    const p = PRESETS[key];
    setForm((f) => ({ ...f, smtp_host: p.smtp_host, smtp_port: p.smtp_port }));
    setActivePreset(key);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "smtp_port" ? Number(value) : value }));
  };

  // ── Save settings ──────────────────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    try {
      await apiRequest("/admin/email-settings", {
        method: "PUT",
        body: form,
      });
      setSaveMsg({ type: "success", text: "SMTP settings saved successfully. Alerts are now active." });
      setConfigured(true);
    } catch (err) {
      setSaveMsg({ type: "error", text: err.message || "Failed to save settings." });
    } finally {
      setSaving(false);
    }
  };

  // ── Test email ─────────────────────────────────────────────────────────────
  const handleTest = async () => {
    if (!testEmail) return;
    setTesting(true);
    setTestMsg(null);
    try {
      const res = await apiRequest("/admin/test-email", {
        method: "POST",
        body: { to_email: testEmail },
      });
      setTestMsg({ type: "success", text: res.message || "Test email sent! Check your inbox." });
    } catch (err) {
      setTestMsg({ type: "error", text: err.message || "Test failed. Check your SMTP credentials." });
    } finally {
      setTesting(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner />
      </div>
    );

  const preset = activePreset ? PRESETS[activePreset] : null;

  return (
    <div className="space-y-10 max-w-4xl">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="title-main mb-2">Email Alert Settings</h2>
          <p className="text-xl text-slate font-medium">
            Configure SMTP so IDENTIX automatically emails officers when a face match is detected.
          </p>
        </div>
        <StatusBadge configured={configured} />
      </div>

      {/* ── How-it-works strip ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Zap, color: "bg-primary/10 text-primary", step: "1", title: "Match Detected", desc: "AI engine finds a face in CCTV or field scan" },
          { icon: Mail, color: "bg-action/10 text-action", step: "2", title: "Alert Composed", desc: "Rich HTML email with frames, profile & confidence score" },
          { icon: Shield, color: "bg-green-100 text-green-600", step: "3", title: "Officers Notified", desc: "Sent instantly to all registered officers' emails" },
        ].map(({ icon: Icon, color, step, title, desc }) => (
          <div key={step} className="card text-center py-6 hover:translate-y-[-4px] transition-all duration-300">
            <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mx-auto mb-3`}>
              <Icon size={22} />
            </div>
            <p className="text-xs font-black text-slate uppercase tracking-widest mb-1">Step {step}</p>
            <p className="font-bold text-ink mb-1">{title}</p>
            <p className="text-sm text-slate font-medium">{desc}</p>
          </div>
        ))}
      </div>

      {/* ── SMTP Config form ── */}
      <form onSubmit={handleSave} className="card space-y-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Server size={20} />
          </div>
          <h3 className="title-section">SMTP Configuration</h3>
        </div>

        {/* Provider presets */}
        <div>
          <p className="text-xs font-black text-slate uppercase tracking-widest mb-3">Quick Provider Setup</p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(PRESETS).map(([key, p]) => (
              <button
                key={key}
                type="button"
                onClick={() => handlePreset(key)}
                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                  activePreset === key
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                    : "bg-white text-slate border-gray-200 hover:border-primary/40 hover:text-primary"
                }`}
              >
                {p.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => { setActivePreset(null); }}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                activePreset === null
                  ? "bg-ink text-white border-ink"
                  : "bg-white text-slate border-gray-200 hover:border-ink/40"
              }`}
            >
              Custom SMTP
            </button>
          </div>

          {preset && (
            <div className="mt-3 flex items-start gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <AlertCircle size={15} className="text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-primary font-medium">
                {preset.hint}{" "}
                <a href={preset.helpUrl} target="_blank" rel="noreferrer" className="underline font-bold">
                  Learn how →
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Fields grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <Field label="SMTP Host" icon={Globe} id="smtp_host">
            <input
              id="smtp_host"
              name="smtp_host"
              type="text"
              value={form.smtp_host}
              onChange={handleChange}
              placeholder="smtp.gmail.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-ink font-medium
                         focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </Field>

          <Field label="SMTP Port" icon={Hash} id="smtp_port">
            <input
              id="smtp_port"
              name="smtp_port"
              type="number"
              value={form.smtp_port}
              onChange={handleChange}
              placeholder="587"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-ink font-medium
                         focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </Field>

          <Field label="Sender Email / Username" icon={AtSign} id="smtp_user">
            <input
              id="smtp_user"
              name="smtp_user"
              type="email"
              value={form.smtp_user}
              onChange={handleChange}
              placeholder="alerts@yourdomain.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-ink font-medium
                         focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </Field>

          <Field label="From Address (display)" icon={Mail} id="smtp_from">
            <input
              id="smtp_from"
              name="smtp_from"
              type="email"
              value={form.smtp_from}
              onChange={handleChange}
              placeholder="identix-alerts@agency.gov"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-ink font-medium
                         focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="SMTP Password / App Password" icon={Lock} id="smtp_pass">
              <div className="relative">
                <input
                  id="smtp_pass"
                  name="smtp_pass"
                  type={showPass ? "text" : "password"}
                  value={form.smtp_pass}
                  onChange={handleChange}
                  placeholder="Leave unchanged to keep existing password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-white text-ink font-medium
                             focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-ink transition"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Field>
          </div>
        </div>

        {/* Save feedback */}
        {saveMsg && (
          <div
            className={`flex items-start gap-3 p-4 rounded-xl border font-medium text-sm ${
              saveMsg.type === "success"
                ? "bg-green-50 border-green-100 text-green-700"
                : "bg-red-50 border-red-100 text-red-600"
            }`}
          >
            {saveMsg.type === "success" ? (
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            ) : (
              <XCircle size={18} className="shrink-0 mt-0.5" />
            )}
            {saveMsg.text}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="btn-primary flex items-center gap-2 px-8 py-3"
        >
          {saving ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save size={18} />
              Save SMTP Settings
            </>
          )}
        </button>
      </form>

      {/* ── Test email panel ── */}
      <div className="card space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-action/10 rounded-lg text-action">
            <Send size={20} />
          </div>
          <div>
            <h3 className="title-section">Send Test Alert Email</h3>
            <p className="text-sm text-slate font-medium">
              Verify your SMTP settings by firing a sample alert email right now.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="recipient@police.gov"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-ink font-medium
                       focus:outline-none focus:ring-2 focus:ring-action/30 focus:border-action transition"
          />
          <button
            type="button"
            onClick={handleTest}
            disabled={testing || !testEmail}
            className="btn-primary flex items-center gap-2 px-6 py-3 bg-action hover:bg-action/90 shadow-action/20"
            style={{ background: testing ? undefined : "#f59e0b" }}
          >
            {testing ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Send size={18} />
                Send Test
              </>
            )}
          </button>
        </div>

        {testMsg && (
          <div
            className={`flex items-start gap-3 p-4 rounded-xl border font-medium text-sm ${
              testMsg.type === "success"
                ? "bg-green-50 border-green-100 text-green-700"
                : "bg-red-50 border-red-100 text-red-600"
            }`}
          >
            {testMsg.type === "success" ? (
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            ) : (
              <XCircle size={18} className="shrink-0 mt-0.5" />
            )}
            {testMsg.text}
          </div>
        )}

        {/* Email preview info card */}
        <div className="bg-ink rounded-2xl p-6 text-white">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
            What officers receive
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            {[
              { icon: "🧑‍💼", title: "Subject Profile", desc: "Name, DOB, national ID, crime / case type" },
              { icon: "📊", title: "Confidence Score", desc: "Visual bar + percentage (colour-coded)" },
              { icon: "🎞️", title: "Detection Frames", desc: "Up to 5 embedded CCTV frames with timestamps" },
              { icon: "📍", title: "Location Details", desc: "Last known location from the database record" },
              { icon: "🕐", title: "Alert Timestamp", desc: "Exact UTC time the match was detected" },
              { icon: "🔗", title: "Dashboard Link", desc: "One-click button to open the IDENTIX dashboard" },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <span className="text-xl">{icon}</span>
                <div>
                  <p className="font-bold text-white">{title}</p>
                  <p className="text-slate-400 text-xs font-medium mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── .env reference ── */}
      <div className="card border border-dashed border-gray-200 bg-gray-50">
        <p className="text-xs font-black text-slate uppercase tracking-widest mb-3">
          Manual .env Configuration (alternative)
        </p>
        <pre className="text-sm font-mono bg-ink text-green-400 rounded-xl p-5 overflow-x-auto leading-relaxed">
{`SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=identix-alerts@agency.gov`}
        </pre>
        <p className="text-xs text-slate font-medium mt-3">
          Settings saved via this page are written directly to <code className="bg-gray-200 px-1.5 py-0.5 rounded text-ink font-mono">backend/.env</code> and applied immediately — no server restart needed.
        </p>
      </div>
    </div>
  );
}

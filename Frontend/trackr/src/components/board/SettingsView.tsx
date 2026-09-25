import { useEffect, useState, type FormEvent } from "react";
import { getProfile, updateProfile, type Profile } from "../../api/profile";
import type { AppDocument } from "../../api/document";
import type { AppInterview } from "../../api/interview";
import type { Job } from "./TableView";

interface SettingsViewProps {
  jobs: Job[];
  documents: AppDocument[];
  interviews: AppInterview[];
  onSettingsSaved: (profile: Profile, preferences: Preferences) => void;
}

type Preferences = {
  jobTitle: string;
  huntLabel: string;
  defaultView: "kanban" | "table";
  currency: "USD ($)" | "INR (₹)" | "EUR (€)" | "GBP (£)";
  interviewReminders: boolean;
  weeklySummary: boolean;
  followUpReminders: boolean;
};

const DEFAULTS: Preferences = {
  jobTitle: "", huntLabel: "2026 Job Hunt", defaultView: "kanban", currency: "USD ($)",
  interviewReminders: true, weeklySummary: false, followUpReminders: true,
};

function readPreferences(): Preferences {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem("jobtrackr-settings") ?? "{}") };
  } catch {
    return DEFAULTS;
  }
}

export default function SettingsView({ jobs, documents, interviews, onSettingsSaved }: SettingsViewProps) {
  const [profile, setProfile] = useState<Profile>({ id: "", name: "", email: "", year: "", skills: [] });
  const [preferences, setPreferences] = useState<Preferences>(readPreferences);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getProfile(localStorage.getItem("token") ?? "")
      .then(setProfile)
      .catch(err => setError(err instanceof Error ? err.message : "Unable to load profile"))
      .finally(() => setLoading(false));
  }, []);

  async function saveSettings(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const updated = await updateProfile(localStorage.getItem("token") ?? "", {
        name: profile.name, email: profile.email, year: profile.year, skills: profile.skills,
      });
      setProfile(updated);
      const savedUser = JSON.parse(localStorage.getItem("user") ?? "{}") as Record<string, unknown>;
      localStorage.setItem("user", JSON.stringify({ ...savedUser, id: updated.id, name: updated.name, email: updated.email }));
      localStorage.setItem("jobtrackr-settings", JSON.stringify(preferences));
      onSettingsSaved(updated, preferences);
      setMessage("Settings saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save settings");
    } finally {
      setSaving(false);
    }
  }

  function exportCsv() {
    const escape = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const rows = [
      ["Company", "Role", "Status", "Salary", "Location", "Date", "Notes"],
      ...jobs.map(job => [job.company, job.role, job.status, job.salary, job.location, job.date, job.notes ?? ""]),
    ];
    const csv = rows.map(row => row.map(escape).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `jobtrackr-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Applications CSV downloaded.");
  }

  function updatePreference<K extends keyof Preferences>(key: K, value: Preferences[K]) {
    setPreferences(current => ({ ...current, [key]: value }));
  }

  function toggleRow(title: string, detail: string, key: "interviewReminders" | "weeklySummary" | "followUpReminders") {
    return <div className="set-row" key={key}>
      <div className="set-row-label"><div className="set-row-lbl-main">{title}</div><div className="set-row-lbl-sub">{detail}</div></div>
      <label className="toggle"><input type="checkbox" checked={preferences[key]} onChange={event => updatePreference(key, event.target.checked)} aria-label={title} /><span className="toggle-slider" /></label>
    </div>;
  }

  return (
    <div className="iv-wrapper">
      <div className="page-hdr"><div><div className="page-hdr-title">Settings</div><div className="page-hdr-sub">Manage your profile and preferences</div></div></div>

      <form onSubmit={saveSettings}>
        <div className="set-section">
          <div className="set-section-title">Profile</div>
          <div className="set-row"><div className="set-row-label"><div className="set-row-lbl-main">Full Name</div></div><input className="set-input" aria-label="Full Name" required value={profile.name} disabled={loading} onChange={event => setProfile({ ...profile, name: event.target.value })} /></div>
          <div className="set-row"><div className="set-row-label"><div className="set-row-lbl-main">Email</div></div><input className="set-input" aria-label="Email" type="email" required value={profile.email} disabled={loading} onChange={event => setProfile({ ...profile, email: event.target.value })} /></div>
          <div className="set-row"><div className="set-row-label"><div className="set-row-lbl-main">Job Title</div><div className="set-row-lbl-sub">Shown in the sidebar</div></div><input className="set-input" aria-label="Job Title" type="text" value={preferences.jobTitle} onChange={event => updatePreference("jobTitle", event.target.value)} /></div>
          <div className="set-row"><div className="set-row-label"><div className="set-row-lbl-main">Hunt Label</div><div className="set-row-lbl-sub">e.g. 2026 Job Hunt</div></div><input className="set-input" aria-label="Hunt Label" type="text" value={preferences.huntLabel} onChange={event => updatePreference("huntLabel", event.target.value)} /></div>
        </div>

        <div className="set-section">
          <div className="set-section-title">Preferences</div>
          <div className="set-row"><div className="set-row-label"><div className="set-row-lbl-main">Default View</div><div className="set-row-lbl-sub">View shown on open</div></div><select className="set-select" aria-label="Default View" value={preferences.defaultView} onChange={event => updatePreference("defaultView", event.target.value as Preferences["defaultView"])}><option value="kanban">Kanban</option><option value="table">Table</option></select></div>
          <div className="set-row"><div className="set-row-label"><div className="set-row-lbl-main">Currency</div></div><select className="set-select" aria-label="Currency" value={preferences.currency} onChange={event => updatePreference("currency", event.target.value as Preferences["currency"])}>{(["USD ($)", "INR (₹)", "EUR (€)", "GBP (£)"] as const).map(currency => <option key={currency}>{currency}</option>)}</select></div>
        </div>

        <div className="set-section">
          <div className="set-section-title">Notifications</div>
          {toggleRow("Interview reminders", "Alert 1 hour before interview", "interviewReminders")}
          {toggleRow("Weekly summary", "Email digest every Monday", "weeklySummary")}
          {toggleRow("Follow-up reminders", "Remind if no reply in 7 days", "followUpReminders")}
          <div className="set-row-lbl-sub settings-note">Notification preferences are saved here. Email delivery and timed reminders require a notification service.</div>
        </div>

        <div className="set-section">
          <div className="set-section-title">Data</div>
          <div className="set-row"><div className="set-row-label"><div className="set-row-lbl-main">Export data</div><div className="set-row-lbl-sub">Download all applications as CSV</div></div><button type="button" className="int-btn" onClick={exportCsv}><i className="ti ti-download" /> Export CSV</button></div>
          <div className="set-row-lbl-sub settings-note">{jobs.length} applications · {interviews.length} interviews · {documents.length} documents in your account</div>
        </div>

        {loading && <div className="empty-msg">Loading profile…</div>}
        {error && <div className="auth-error settings-feedback">{error}</div>}
        {message && <div className="settings-success" role="status">{message}</div>}
        <div className="set-save-row"><button className="set-save-btn" type="submit" disabled={saving || loading}>{saving ? "Saving…" : "Save Changes"}</button></div>
      </form>
    </div>
  );
}

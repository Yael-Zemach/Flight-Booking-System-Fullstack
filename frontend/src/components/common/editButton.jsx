import { useEffect, useState } from "react";

export default function EditButton({
  itemId,
  data,
  onSave, 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(data ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // כשכותרת מתעדכנת מההורה — ניישר טיוטה רק אם לא באמצע עריכה
  useEffect(() => {
    if (!isEditing) setDraft(data ?? "");
  }, [data, isEditing]);

  const trimmedDraft = String(draft ?? "").trim();
  const trimmedData = String(data ?? "").trim();
  const isDirty = trimmedDraft !== trimmedData;

  function startEdit() {
    if (loading) return;
    setError("");
    setDraft(data ?? "");
    setIsEditing(true);
  }

  function cancelEdit() {
    setError("");
    setDraft(data ?? "");
    setIsEditing(false);
  }

  async function handleSave() {
    if (loading) return;

    if (!trimmedDraft) {
      setError("חובה למלא כותרת");
      return;
    }

    if (!isDirty) {
      setIsEditing(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      await onSave(itemId, trimmedDraft);
      setIsEditing(false);
    } catch {
      setError("שגיאה בשמירה");
    } finally {
      setLoading(false);
    }
  }

  if (!isEditing) {
    return (
      <div className="item-data-row">
        <div className="item-data">{data}</div>
        <button type="button" onClick={startEdit} disabled={loading} title="עריכה">
          {"✏️"}
        </button>
      </div>
    );
  }

  return (
    <div className="item-data-editor">
      <div className="item-data-editor-row">
        <input
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            if (error) setError("");
          }}
          disabled={loading}
          placeholder="כותרת..."
        />

        <button type="button" onClick={handleSave} disabled={loading}>
          {loading ? "שומר..." : "שמור"}
        </button>

        <button type="button" onClick={cancelEdit} disabled={loading}>
          {"ביטול"}
        </button>
      </div>

      {error && <div className="item-error">{error}</div>}
    </div>
  );
}
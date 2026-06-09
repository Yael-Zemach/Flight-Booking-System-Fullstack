import { useState } from "react";

export default function AddItemBar({
  onAdd,
  onError,
  addBody,         
}) {
  const [textTitle, setTextTitle] = useState("");
  const [textBody, setTextBody] = useState("");
  const [loading, setLoading] = useState(false);
  const minLen = 1;// מחיב שהכותרת תהיה לפחות תו אחד
  const canSubmit = textTitle.trim().length >= minLen && !loading;

  async function submit() {
    if (!canSubmit) return;
    try {
      setLoading(true);
      if (addBody) {
        await onAdd(textTitle.trim(), textBody.trim());
        setTextTitle("");
        setTextBody("");
      } else {
        await onAdd(textTitle.trim());
        setTextTitle("");
      }
    } catch (err) {
      onError();
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="add-item-container"
      style={{ display: "flex", gap: 8, alignItems: "center" }}
    >
      <input className="add-item-input"
        value={textTitle}
        onChange={(e) => setTextTitle(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={"הוסיפי כותרת חדשה..."}
        disabled={loading}
      />
      {addBody && <input className="add-item-input"
        value={textBody}
        onChange={(e) => setTextBody(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={"הוסיפי גוף חדש..."}
        disabled={loading}
      />}

      <button type="button" onClick={submit} disabled={!canSubmit} className="add-item-button">
        {loading ? "מוסיף..." : "הוסף"}
      </button>
    </div>
  );
}
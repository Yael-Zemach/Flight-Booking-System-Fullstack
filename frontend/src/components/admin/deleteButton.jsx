import { useState } from "react";

export default function DeleteButton({
  onDelete,
  onError, 
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;

      const ok = window.confirm("בטוחה למחוק?",);
      if (!ok) return;

    try {
      setLoading(true);
      await onDelete();
    } catch (err) {
      onError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? "מוחק..." : "מחק"}
    </button>
  );
}
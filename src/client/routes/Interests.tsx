import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignUpBox } from "@components/SignUpBox";
import { getAllTags } from "@lib/tags";
import { addUserInterest } from "@lib/interests";
import { getCurrentUser } from "@lib/users";
import "@client/Interests.css";

export const InterestsPage = () => {
  const [tags, setTags] = useState<any[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAllTags()
      .then((t) => setTags(t ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const handleContinue = async () => {
    if (selectedTagIds.length < 3) {
      setError("Please select at least 3 interests.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error("Not logged in.");
      await Promise.all(
        selectedTagIds.map((tagId) => addUserInterest(user.id, tagId)),
      );
      navigate("/events");
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setSaving(false);
    }
  };

  const rows: any[][] = [];
  for (let i = 0; i < tags.length; i += 2) {
    rows.push(tags.slice(i, i + 2));
  }

  return (
    <div className="flex justify-center items-center h-full">
      <SignUpBox>
        <h1 className="font-redhat text-2xl font-semibold text-black p-10">
          Tell us what interests you so we can curate a better experience.
        </h1>
        <h2 className="flex font-redhat text-xl text-black justify-center">
          Please choose at least three
        </h2>
        {loading ? (
          <p style={{ textAlign: "center", padding: "20px" }}>Loading...</p>
        ) : (
          <div>
            {rows.map((row, i) => (
              <div className="flex justify-center" key={i}>
                {row.map((tag) => (
                  <button
                    key={tag.tag_id}
                    className="bg-customGray text-black border-none w-[200px] rounded p-4 text-xl font-redhat cursor-pointer m-3"
                    style={
                      selectedTagIds.includes(tag.tag_id)
                        ? { backgroundColor: "#BAC67A" }
                        : undefined
                    }
                    onClick={() => toggleTag(tag.tag_id)}
                  >
                    {tag.tag_name}
                  </button>
                ))}
              </div>
            ))}
            {error && (
              <p style={{ color: "red", textAlign: "center", margin: "8px 0" }}>
                {error}
              </p>
            )}
            <div className="flex justify-center">
              <button
                className="bg-customGreen text-black w-[200px] rounded p-4 text-xl font-redhat"
                onClick={handleContinue}
                disabled={saving}
                style={{ cursor: saving ? "not-allowed" : "pointer" }}
              >
                {saving ? "Saving..." : "Continue"}
              </button>
            </div>
          </div>
        )}
      </SignUpBox>
    </div>
  );
};

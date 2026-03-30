import { useEffect, useMemo, useRef, useState } from "react";
import { getCurrentUser, getUserById } from "@lib/users";
import { getAllTags } from "@lib/tags";
import { getUserInterests, replaceUserInterests } from "@lib/interests";

type Tag = {
  tag_id: string;
  tag_name: string;
};

type ProfileRecord = {
  display_name: string;
  email: string;
  date_of_birth: string | null;
  created_at: string | null;
};

function formatDate(value: string | null, fallback = "Not provided") {
  if (!value) {
    return fallback;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

export function ProfilePage() {
  const isSavingRef = useRef(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [savedTagIds, setSavedTagIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const authUser = await getCurrentUser();
        if (!authUser) {
          setError("You must be logged in to view your profile.");
          return;
        }

        setUserId(authUser.id);

        const [profileRecord, allTags, interests] = await Promise.all([
          getUserById(authUser.id),
          getAllTags(),
          getUserInterests(authUser.id),
        ]);

        const tagIds = (interests ?? []).map((tag: Tag) => tag.tag_id);

        setProfile({
          display_name: profileRecord?.display_name || "Unnamed user",
          email: profileRecord?.email || authUser.email || "No email available",
          date_of_birth: profileRecord?.date_of_birth || null,
          created_at: profileRecord?.created_at || null,
        });
        setTags((allTags ?? []) as Tag[]);
        setSelectedTagIds(tagIds);
        setSavedTagIds(tagIds);
      } catch (loadError: any) {
        setError(loadError?.message || "Failed to load your profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const hasUnsavedChanges = useMemo(() => {
    if (selectedTagIds.length !== savedTagIds.length) {
      return true;
    }

    const saved = new Set(savedTagIds);
    return selectedTagIds.some((tagId) => !saved.has(tagId));
  }, [savedTagIds, selectedTagIds]);

  const toggleTag = (tagId: string) => {
    setSuccessMessage(null);
    setSelectedTagIds((current) =>
      current.includes(tagId)
        ? current.filter((id) => id !== tagId)
        : [...current, tagId],
    );
  };

  const handleSavePreferences = async () => {
    if (isSavingRef.current) {
      return;
    }

    if (!userId) {
      setError("You must be logged in to update your preferences.");
      return;
    }

    try {
      isSavingRef.current = true;
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      await replaceUserInterests(userId, selectedTagIds);

      const updatedInterests = await getUserInterests(userId);
      const updatedTagIds = (updatedInterests ?? []).map((tag: Tag) => tag.tag_id);

      setSelectedTagIds(updatedTagIds);
      setSavedTagIds(updatedTagIds);
      setSuccessMessage("Your preferences were updated.");
    } catch (saveError: any) {
      setError(saveError?.message || "Failed to update your preferences.");
    } finally {
      isSavingRef.current = false;
      setSaving(false);
    }
  };

  return (
    <div className="px-6 py-10 text-black md:px-10 lg:px-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="rounded-[2rem] border border-black/10 bg-customBeige p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-black/50">
                Account
              </p>
              <h1 className="mt-2 font-oswald text-5xl leading-none">
                My Profile
              </h1>
              <p className="mt-3 max-w-2xl font-redhat text-base text-black/70">
                View your profile details and update the event preferences used
                to personalize your experience.
              </p>
            </div>

            {profile && (
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-customBlue bg-customDarkBlue text-3xl font-semibold text-black">
                {profile.display_name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div className="rounded-[2rem] border border-black/10 bg-customBeige p-8 shadow-sm">
            <p className="font-redhat text-black/70">Loading your profile...</p>
          </div>
        )}

        {!loading && error && !profile && (
          <div className="rounded-[2rem] border border-customBrown bg-customBeige p-8 text-customBrown shadow-sm">
            {error}
          </div>
        )}

        {!loading && profile && (
          <>
            <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[2rem] border border-black/10 bg-customBeige p-8 shadow-sm">
                <h2 className="font-oswald text-3xl">Profile Details</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-customBlue/20 p-4">
                    <p className="text-sm uppercase tracking-[0.2em] text-black/45">
                      Name
                    </p>
                    <p className="mt-2 font-redhat text-lg font-semibold">
                      {profile.display_name}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-customGreen/25 p-4">
                    <p className="text-sm uppercase tracking-[0.2em] text-black/45">
                      Email
                    </p>
                    <p className="mt-2 break-all font-redhat text-lg font-semibold">
                      {profile.email}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-customGreen/25 p-4">
                    <p className="text-sm uppercase tracking-[0.2em] text-black/45">
                      Date of Birth
                    </p>
                    <p className="mt-2 font-redhat text-lg font-semibold">
                      {formatDate(profile.date_of_birth)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-customBlue/25 p-4">
                    <p className="text-sm uppercase tracking-[0.2em] text-black/45">
                      Profile Created
                    </p>
                    <p className="mt-2 font-redhat text-lg font-semibold">
                      {formatDate(profile.created_at)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-black/10 bg-customBlue/30 p-8 shadow-sm">
                <p className="text-sm uppercase tracking-[0.25em] text-black/45">
                  Preferences Summary
                </p>
                <p className="mt-3 font-oswald text-3xl leading-tight">
                  {selectedTagIds.length} preference{selectedTagIds.length === 1 ? "" : "s"} selected
                </p>
                <p className="mt-3 font-redhat text-black/65">
                  Update the topics that should influence what events are shown
                  first across the app.
                </p>

                <div className="mt-6 rounded-2xl border border-black/10 bg-customBeige p-4">
                  <p className="font-redhat text-sm text-black/55">
                    Changes are saved to your account and will affect future
                    event recommendations.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-black/10 bg-customBeige p-8 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="font-oswald text-3xl">User Preferences</h2>
                  <p className="mt-2 font-redhat text-black/65">
                    Select the interests you want attached to your profile.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSavePreferences}
                  disabled={!hasUnsavedChanges || saving}
                  className="rounded-full bg-customGreen px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Preferences"}
                </button>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {tags.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag.tag_id);

                  return (
                    <button
                      key={tag.tag_id}
                      type="button"
                      onClick={() => toggleTag(tag.tag_id)}
                      className={`rounded-full border px-5 py-3 font-semibold transition ${
                        isSelected
                          ? "border-black bg-customBlue text-black"
                          : "border-black/15 bg-customBeige text-black/70 hover:bg-customGray"
                      }`}
                    >
                      {tag.tag_name}
                    </button>
                  );
                })}
              </div>

              {error && (
                <p className="mt-5 font-redhat text-sm text-customBrown">{error}</p>
              )}
              {successMessage && (
                <p className="mt-5 font-redhat text-sm text-customGreen">
                  {successMessage}
                </p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
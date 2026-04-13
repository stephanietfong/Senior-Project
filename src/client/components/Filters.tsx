type FiltersProps = {
  tags: any[];
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  children?: React.ReactNode;
};

export const Filters = ({
  tags,
  selectedTags,
  setSelectedTags,
  children,
}: FiltersProps) => {
  function toggleTag(tagName: string) {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName],
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg min-w-[400px]">
      <h2 className="text-xl font-semibold mb-4">Filter by Tags</h2>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <button
            key={tag.tag_id}
            onClick={() => toggleTag(tag.tag_name)}
            className={`px-4 py-2 rounded-full border ${
              selectedTags.includes(tag.tag_name)
                ? "bg-customGreen text-white"
                : "bg-gray-100"
            }`}
          >
            {tag.tag_name}
          </button>
        ))}
      </div>

      {children}
    </div>
  );
};

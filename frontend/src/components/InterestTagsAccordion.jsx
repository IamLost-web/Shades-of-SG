import React from "react";

export default function InterestTagsAccordion({ selectedTags, setSelectedTags }) {
    const sections = {
        Events: ["National Day"],
        Culture: ["Malay Culture", "Chinese Culture", "Tamil Culture"],
    };

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    return (
        <div className="accordion">
            {Object.entries(sections).map(([section, tags]) => (
                <div key={section}>
                    <h3>{section}</h3>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {tags.map(tag => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => toggleTag(tag)}
                                style={{
                                    backgroundColor: selectedTags.includes(tag) ? "purple" : "white",
                                    color: selectedTags.includes(tag) ? "white" : "black",
                                    border: "1px solid black",
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

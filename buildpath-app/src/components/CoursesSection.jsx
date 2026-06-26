// src/components/CoursesSection.jsx
import React, { useState, useEffect } from "react";
import courses from "../data/courses";
import { useGamification } from "../hooks/useGamification"; // <-- Ye brackets ke sath hona chahiye bhai!!

const COMPLETED_KEY = "app_completed_topics";

function getCompletedTopics() {
  try {
    return JSON.parse(localStorage.getItem(COMPLETED_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function CoursesSection() {
  const [activeCategory, setActiveCategory] = useState(courses[0].id);
  const [completed, setCompleted] = useState(getCompletedTopics());
  
  // Firebase functions ko hook se nikal liya
  const { completeVideo, completeCourse } = useGamification();

  useEffect(() => {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completed));
  }, [completed]);

  const handleComplete = async (topic, module) => {
    if (completed.includes(topic.id)) return; // double entry block
    
    // 1. Local state update karo (taaki UI me checkbox check ho jaye)
    const newCompleted = [...completed, topic.id];
    setCompleted(newCompleted);

    try {
      // 2. Firebase par call karo! (Har single topic complete karne par video barabar 10 XP milenge aur streak badhegi)
      await completeVideo();

      // 3. Check karo agar poora module khatam ho gaya hai toh bonus 50 XP do!
      const allModuleTopicIds = module.topics.map((t) => t.id);
      const isModuleFullyDone = allModuleTopicIds.every((id) => newCompleted.includes(id));
      
      if (isModuleFullyDone) {
        await completeCourse();
        alert(`🔥 Booster Alert! Pura "${module.title}" module khatam karne par +50 XP mil gaye!`);
      }
    } catch (err) {
      console.error("XP update karne me error aaya: ", err);
    }
  };

  const activeCourse = courses.find((c) => c.id === activeCategory);

  return (
    <div style={{ fontFamily: "monospace", padding: "20px", color: "#cfe9de" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>📚 Study Courses</h2>
      </div>

      {/* Category tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {courses.map((course) => (
          <button
            key={course.id}
            onClick={() => setActiveCategory(course.id)}
            style={{
              padding: "10px 18px",
              borderRadius: "20px",
              border: `1px solid ${activeCategory === course.id ? "#39ff9e" : "#163029"}`,
              cursor: "pointer",
              fontWeight: 600,
              fontFamily: "inherit",
              color: activeCategory === course.id ? "#39ff9e" : "#cfe9de",
              background: activeCategory === course.id ? "rgba(57,255,158,0.1)" : "#0e1815",
              transition: "all 0.2s",
            }}
          >
            {course.icon} {course.title}
          </button>
        ))}
      </div>

      {/* Modules + topics for active category */}
      {activeCourse.modules.map((module) => {
        const moduleCompletedCount = module.topics.filter((t) => completed.includes(t.id)).length;
        return (
          <div key={module.id} style={{ marginBottom: "24px", background: "#0e1815", padding: "15px", borderRadius: "10px", border: "1px solid #163029" }}>
            <h3 style={{ borderLeft: `4px solid ${activeCourse.color}`, paddingLeft: "10px", marginTop: 0, color: "#39ff9e" }}>
              {module.title}{" "}
              <span style={{ fontSize: "13px", color: "#cfe9de", opacity: 0.7 }}>
                ({moduleCompletedCount}/{module.topics.length} done)
              </span>
            </h3>

            <div style={{ display: "grid", gap: "10px" }}>
              {module.topics.map((topic) => {
                const isDone = completed.includes(topic.id);
                return (
                  <div
                    key={topic.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      borderRadius: "10px",
                      background: isDone ? "rgba(57,255,158,0.05)" : "#060a09",
                      border: `1px solid ${isDone ? "#39ff9e" : "#163029"}`,
                    }}
                  >
                    <div>
                      <a
                        href={topic.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontWeight: 600, color: "#39ff9e", textDecoration: "none" }}
                      >
                        {topic.title} ↗
                      </a>
                      <div style={{ fontSize: "12px", color: "#cfe9de", opacity: 0.5 }}>+{topic.xp} XP</div>
                    </div>

                    <button
                      onClick={() => handleComplete(topic, module)}
                      disabled={isDone}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "20px",
                        border: `1px solid ${isDone ? "#39ff9e" : activeCourse.color}`,
                        cursor: isDone ? "default" : "pointer",
                        background: isDone ? "transparent" : activeCourse.color,
                        color: isDone ? "#39ff9e" : "#fff",
                        fontWeight: 600,
                        fontFamily: "inherit"
                      }}
                    >
                      {isDone ? "✓ Done" : "Mark Complete"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
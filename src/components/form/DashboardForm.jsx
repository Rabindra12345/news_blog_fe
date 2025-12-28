import React, { useEffect, useRef, useState } from "react";
import "./DashboardForm.css";
import Ck from "../editor/Ck";
import Swal from "sweetalert2";
import Select from "react-select";
import { API_BASE_URL } from '../../api/config';
import CreatableSelect from "react-select/creatable";

const DashboardForm = ({ onFormSubmit }) => {
  const [title, setTitle] = useState("");
  const [textBody, setTextBody] = useState("");
  const [textImages, setTextImages] = useState([]);

  const [categories, setCategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]); // multi
  const [loadingCats, setLoadingCats] = useState(true);

  // Tags: store as array of strings
  const [tags, setTags] = useState([]); // ["sports", "breaking-news"]

  const fileInputRef = useRef(null);

  const userId = "123"; // keep only if backend requires it

  useEffect(() => {
    setLoadingCats(true);

    fetch(`${API_BASE_URL}/public/api/news/categories`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load categories");
        return r.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.content || [];
        setCategories(list);
      })
      .catch((err) => {
        console.error("Category fetch error:", err);
        setCategories([]);
      })
      .finally(() => setLoadingCats(false));
  }, []);

  const handleTextImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setTextImages(files);
  };

  // react-select options (categories)
  const categoryOptions = categories.map((c) => ({
    value: String(c.id),
    label: c.name,
  }));

  const selectedCategoryOptions = categoryOptions.filter((o) =>
    categoryIds.includes(o.value)
  );

  // Tags -> creatable select needs options+value format
  const tagOptions = tags.map((t) => ({ value: t, label: t }));
  const selectedTagOptions = tags.map((t) => ({ value: t, label: t }));

  const normalizeTag = (raw) =>
    String(raw || "")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryIds.length) {
      Swal.fire("Please select at least one category.", "", "warning");
      return;
    }

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("textBody", textBody);

    // remove this if you remove userId from backend
    formData.append("userId", userId);

    // send multiple category ids: categoryIds=1&categoryIds=2...
    categoryIds.forEach((id) => formData.append("categoryIds", id));

    // send multiple tags: tags=tag1&tags=tag2...
    tags.forEach((t) => formData.append("tags", t)); // <-- change key if backend expects "tagNames" etc.

    textImages.forEach((image) => {
      formData.append("textImages", image);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/news`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        onFormSubmit?.();
        Swal.fire("News added successfully.", "", "success");

        setTitle("");
        setTextBody("");
        setTextImages([]);
        setCategoryIds([]);
        setTags([]);

        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        const msg = await response.text();
        console.error("Form submission failed:", msg);
        Swal.fire("Failed to submit news.", msg || "", "error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire("Error submitting news.", error.message || "", "error");
    }
  };

  return (
    <div className="form-container">
      <h2>Submit News Article</h2>

      <form onSubmit={handleSubmit} className="news-form">
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter title..."
          />
        </div>

        {/* Categories (multi-select dropdown) */}
        <div className="form-group">
          <label>Categories:</label>

          {loadingCats ? (
            <div className="hint">Loading categories...</div>
          ) : categoryOptions.length ? (
            <Select
              className="select-control"
              classNamePrefix="rs"
              isMulti
              placeholder="Select categories..."
              options={categoryOptions}
              value={selectedCategoryOptions}
              onChange={(selected) => {
                const ids = (selected || []).map((x) => x.value);
                setCategoryIds(ids);
              }}
              closeMenuOnSelect={false}
            />
          ) : (
            <div className="hint error">No categories found.</div>
          )}
        </div>

        {/* Tags (creatable multi-select) */}
        <div className="form-group">
          <label>Tags:</label>

          <CreatableSelect
            className="select-control"
            classNamePrefix="rs"
            isMulti
            placeholder="Type a tag and press Enter..."
            options={tagOptions}
            value={selectedTagOptions}
            onChange={(selected) => {
              const next = (selected || [])
                .map((x) => normalizeTag(x.value))
                .filter(Boolean);

              // de-duplicate
              setTags(Array.from(new Set(next)));
            }}
            onCreateOption={(inputValue) => {
              const t = normalizeTag(inputValue);
              if (!t) return;
              setTags((prev) => Array.from(new Set([...prev, t])));
            }}
          />

          <div className="hint">
            Example: <span className="mono">breaking</span>,{" "}
            <span className="mono">nepal</span>, <span className="mono">sports</span>
          </div>
        </div>

        {/* Body */}
        <div className="form-group">
          <label htmlFor="textBody">Text Body:</label>
          <Ck
            data={textBody}
            config={{ placeholder: "Write your content here..." }}
            onChange={setTextBody}
          />
        </div>

        {/* Images */}
        <div className="form-group">
          <label htmlFor="textImages">Text Images:</label>
          <input
            ref={fileInputRef}
            type="file"
            id="textImages"
            multiple
            accept="image/*"
            onChange={handleTextImagesChange}
          />
          {textImages.length ? (
            <div className="hint">
              {textImages.length} file(s) selected
            </div>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={loadingCats || !categoryOptions.length}
          className="submit-btn"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default DashboardForm;



// const DashboardForm = ({ onFormSubmit }) => {
//   const [title, setTitle] = useState("");
//   const [textBody, setTextBody] = useState("");
//   const [textImages, setTextImages] = useState([]);

//   const [categories, setCategories] = useState([]);
//   const [categoryIds, setCategoryIds] = useState([]); // multi
//   const [loadingCats, setLoadingCats] = useState(true);

//   const fileInputRef = useRef(null);

//   const userId = "123"; // keep only if backend requires it

//   useEffect(() => {
//     setLoadingCats(true);

//     fetch(`${API_BASE_URL}/public/api/news/categories`)
//       .then((r) => {
//         if (!r.ok) throw new Error("Failed to load categories");
//         return r.json();
//       })
//       .then((data) => {
//         const list = Array.isArray(data) ? data : data?.content || [];
//         setCategories(list);
//       })
//       .catch((err) => {
//         console.error("Category fetch error:", err);
//         setCategories([]);
//       })
//       .finally(() => setLoadingCats(false));
//   }, []);

//   const handleTextImagesChange = (e) => {
//     const files = Array.from(e.target.files || []);
//     setTextImages(files);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!categoryIds.length) {
//       Swal.fire("Please select at least one category.", "", "warning");
//       return;
//     }

//     const token = localStorage.getItem("token");

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("textBody", textBody);

//     // remove this if you remove userId from backend
//     formData.append("userId", userId);

//     // send multiple category ids: categoryIds=1&categoryIds=2...
//     categoryIds.forEach((id) => formData.append("categoryIds", id));

//     textImages.forEach((image) => {
//       formData.append("textImages", image);
//     });

//     try {
//       const response = await fetch(`${API_BASE_URL}/api/news`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       if (response.ok) {
//         onFormSubmit?.();
//         Swal.fire("News added successfully.", "", "success");

//         setTitle("");
//         setTextBody("");
//         setTextImages([]);
//         setCategoryIds([]);

//         if (fileInputRef.current) fileInputRef.current.value = "";
//       } else {
//         const msg = await response.text();
//         console.error("Form submission failed:", msg);
//         Swal.fire("Failed to submit news.", msg || "", "error");
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       Swal.fire("Error submitting news.", error.message || "", "error");
//     }
//   };

//   // react-select options
//   const categoryOptions = categories.map((c) => ({
//     value: String(c.id),
//     label: c.name,
//   }));

//   // react-select selected values
//   const selectedCategoryOptions = categoryOptions.filter((o) =>
//     categoryIds.includes(o.value)
//   );

//   return (
//     <div className="form-container">
//       <h2>Submit News Article</h2>

//       <form onSubmit={handleSubmit}>
//         {/* Title */}
//         <div className="form-group">
//           <label htmlFor="title">Title:</label>
//           <input
//             type="text"
//             id="title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//           />
//         </div>

//         {/* Categories (multi-select dropdown) */}
//         <div className="form-group">
//           <label>Categories:</label>

//           {loadingCats ? (
//             <div className="hint">Loading categories...</div>
//           ) : categoryOptions.length ? (
//             <Select
//               className="category-select"
//               classNamePrefix="rs"
//               isMulti
//               placeholder="Select categories..."
//               options={categoryOptions}
//               value={selectedCategoryOptions}
//               onChange={(selected) => {
//                 const ids = (selected || []).map((x) => x.value);
//                 setCategoryIds(ids);
//               }}
//               closeMenuOnSelect={false}
//             />
//           ) : (
//             <div className="hint error">No categories found.</div>
//           )}
//         </div>

//         {/* Body */}
//         <div className="form-group">
//           <label htmlFor="textBody">Text Body:</label>
//           <Ck
//             data={textBody}
//             config={{ placeholder: "Write your content here..." }}
//             onChange={setTextBody}
//           />
//         </div>

//         {/* Images */}
//         <div className="form-group">
//           <label htmlFor="textImages">Text Images:</label>
//           <input
//             ref={fileInputRef}
//             type="file"
//             id="textImages"
//             multiple
//             accept="image/*"
//             onChange={handleTextImagesChange}
//           />
//         </div>

//         <button type="submit" disabled={!categories.length}>
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default DashboardForm;





import React, { useEffect, useState } from "react";
import "./DashboardForm.css";
import Ck from "../editor/Ck";
import Swal from "sweetalert2";

const DashboardForm = ({ onFormSubmit }) => {
  const [title, setTitle] = useState("");
  const [textBody, setTextBody] = useState("");
  const [textImages, setTextImages] = useState([]);

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [loadingCats, setLoadingCats] = useState(true);

  const userId = "123"; // TODO replace with real user id later

  useEffect(() => {
    setLoadingCats(true);

    fetch("http://localhost:8081/public/api/news/categories")
        // fetch("http://localhost:8081/api/categories", {
        //   headers: { Authorization: `Bearer ${token}` }
        // })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load categories");
        return r.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.content || [];
        setCategories(list);

        // auto select first category (optional)
        if (list.length && !categoryId) {
          setCategoryId(String(list[0].id));
        }
      })
      .catch((err) => {
        console.error("Category fetch error:", err);
        setCategories([]);
      })
      .finally(() => setLoadingCats(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTextImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setTextImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId) {
      Swal.fire("Please select a category.", "", "warning");
      return;
    }

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("textBody", textBody);
    formData.append("userId", userId);

    formData.append("categoryId", categoryId);

    textImages.forEach((image) => {
      formData.append("textImages", image);
    });

    try {
      const response = await fetch("http://localhost:8081/api/news", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        onFormSubmit?.();
        Swal.fire("News added successfully.", "", "success");

        // reset form
        setTitle("");
        setTextBody("");
        setTextImages([]);
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

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category">Category:</label>

          {loadingCats ? (
            <div className="hint">Loading categories...</div>
          ) : categories.length ? (
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="hint error">
              No categories found. Check the categories API.
            </div>
          )}
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
            type="file"
            id="textImages"
            multiple
            accept="image/*"
            onChange={handleTextImagesChange}
          />
        </div>

        <button type="submit" disabled={!categories.length}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default DashboardForm;



// import React, { useState } from 'react';
// import './DashboardForm.css';
// import Ck from '../editor/Ck';
// import Swal from 'sweetalert2';

// const DashboardForm = ({ onFormSubmit }) => {
//   const [title, setTitle] = useState('');
//   const [textBody, setTextBody] = useState('');
//   const userId = '123';
//   const [textImages, setTextImages] = useState([]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const token = localStorage.getItem('token');

//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('textBody', textBody);
//     formData.append('userId', userId);

//     textImages.forEach((image) => {
//       formData.append('textImages', image);
//     });

//     try {
//       const response = await fetch('http://localhost:8081/api/news', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`
//         },
//         body: formData,
//       });

//       if (response.ok) {
//         console.log('Form submitted successfully');
//         onFormSubmit();
//         Swal.fire("News added successfully.", 'success');
//       } else {
//         console.error('Form submission failed');
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//     }
//   };

//   const handleTextImagesChange = (e) => {
//     const files = Array.from(e.target.files);
//     setTextImages(files);
//   };
//   return (
//     <div className="form-container">
//       <h2>Submit News Article</h2>
//       <form onSubmit={handleSubmit}>
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

//         <div className="form-group">
//           <label htmlFor="textBody">Text Body:</label>
//           <Ck
//             data={textBody}
//             config={{ placeholder: 'Write your content here...' }}
//             onChange={setTextBody}
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="textImages">Text Images:</label>
//           <input
//             type="file"
//             id="textImages"
//             multiple
//             accept="image/*"
//             onChange={handleTextImagesChange}
//           />
//         </div>

//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default DashboardForm;

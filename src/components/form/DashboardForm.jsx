import React, { useState } from 'react';
import './DashboardForm.css';
import Ck from '../editor/Ck';
import Swal from 'sweetalert2';

const DashboardForm = ({ onFormSubmit }) => {
    const [title, setTitle] = useState('');
    const [textBody, setTextBody] = useState('');
    const userId = '123';
    const [textImages, setTextImages] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('textBody', textBody);
        formData.append('userId', userId);

        textImages.forEach((image, index) => {
            formData.append(`textImages[${index}]`, image);
        });

        try {
            const response = await fetch('http://localhost:8081/api/news', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                console.log('Form submitted successfully');
                onFormSubmit();
            } else {
                console.error('Form submission failed');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleTextImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setTextImages(files);
    };

    const handleSubmission = () => {
        Swal.fire("News added successfully.", 'success');
    };

    return (
        <div className="form-container">
            <h2>Submit News Article</h2>
            <form onSubmit={handleSubmit}>
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
                <div className="form-group">
                    <label htmlFor="textBody">Text Body:</label>
                    <Ck
                        data={textBody}
                        config={{ placeholder: 'Write your content here...' }}
                        onChange={setTextBody}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="textImages">Text Images:</label>
                    <input
                        type="file"
                        id="textImages"
                        multiple
                        onChange={handleTextImagesChange}
                    />
                </div>
                <button type="submit" onClick={handleSubmission}>Submit</button>
            </form>
        </div>
    );
};

export default DashboardForm;

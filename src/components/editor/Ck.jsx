import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const Ck = ({ data, config, onChange }) => {
    return (
        <CKEditor
            editor={ClassicEditor}
            data={data}
            config={config}
            onChange={(event, editor) => {
                const editorData = editor.getData();
                onChange(editorData);
            }}
        />
    );
};


export default Ck;

/* eslint-disable react/prop-types */

export default function UploadDropzone({ onUpload }) {
  const handleChange = (event) => {
    const files = event?.target?.files || event?.detail?.files;
    if (!files?.length) return;

    onUpload(files[0]);
  };

  return (
    <s-drop-zone
      accept="image/*"
      multiple
      onChange={handleChange}
      accessibilityLabel="Upload image files"
    />
  );
}

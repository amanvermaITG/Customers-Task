
/* eslint-disable react/prop-types */
export default function UploadStatus({ fetcher }) {
  if (fetcher.state === "submitting") {
    return (
      <s-box padding="base">
        <s-inline-spinner>Uploading...</s-inline-spinner>
      </s-box>
    );
  }

  if (fetcher.data?.success) {
    return (
      <s-box padding="base">
        <s-banner tone="success">File Uploaded Successfully!</s-banner>
      </s-box>
    );
  }

  if (fetcher.data?.error) {
    return (
      <s-box padding="base">
        <s-banner tone="critical">{fetcher.data.error}</s-banner>
      </s-box>
    );
  }

  return null;
}

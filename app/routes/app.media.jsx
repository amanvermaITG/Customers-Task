/* eslint-disable react/prop-types */
import { authenticate } from "../shopify.server";
import { useFetcher } from "react-router";
import UploadDropzone from "../components/UploadDropzone";
import UploadStatus from "../components/UploadStatus";
import { handleFileUpload } from "../server/upload.server";

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);

  const formData = await request.formData();
  const file = formData.get("file");

  return handleFileUpload(admin, file);
}

export default function Media() {
  const fetcher = useFetcher();

  const onUpload = (file) => {
    const fd = new FormData();
    fd.append("file", file);

    fetcher.submit(fd, {
      method: "post",
      encType: "multipart/form-data",
    });
  };

  return (
    <s-page heading="Media">
      <s-section heading="UploadDropzone Files">
        <UploadDropzone onUpload={onUpload} />
      </s-section>

      <UploadStatus fetcher={fetcher} />
    </s-page>
  );
}

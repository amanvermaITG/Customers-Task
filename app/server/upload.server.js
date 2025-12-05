import { Buffer } from "node:buffer";

export async function handleFileUpload(admin, file) {
  if (!file) return { error: "No file found" };

  const buffer = Buffer.from(await file.arrayBuffer());

  // ---------------- STEP 1: stagedUploadsCreate ----------------
  const stagedRes = await admin.graphql(
    `
      mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
        stagedUploadsCreate(input: $input) {
          stagedTargets {
            url
            resourceUrl
            parameters {
              name
              value
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      variables: {
        input: [
          {
            resource: "FILE",
            filename: file.name,
            mimeType: file.type,
            httpMethod: "POST",
          },
        ],
      },
    }
  );

  const stagedJson = await stagedRes.json();
  const target = stagedJson.data?.stagedUploadsCreate?.stagedTargets?.[0];

  if (!target) {
    return { error: "Failed to create staged upload target" };
  }

  // Upload to S3
  const uploadForm = new FormData();
  target.parameters.forEach((p) => uploadForm.append(p.name, p.value));
  uploadForm.append("file", new Blob([buffer], { type: file.type }));

  await fetch(target.url, {
    method: "POST",
    body: uploadForm,
  });

  // ---------------- STEP 2: fileCreate -----------------------
  const createRes = await admin.graphql(
    `
      mutation fileCreate($files: [FileCreateInput!]!) {
        fileCreate(files: $files) {
          files {
            ... on MediaImage {
              id
              image {
                url
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      variables: {
        files: [
          {
            originalSource: target.resourceUrl,
          },
        ],
      },
    }
  );

  const fileJson = await createRes.json();

  if (fileJson.data.fileCreate.userErrors.length > 0) {
    return { error: fileJson.data.fileCreate.userErrors[0].message };
  }

  return {
    success: true,
    file: fileJson.data.fileCreate.files[0],
  };
}

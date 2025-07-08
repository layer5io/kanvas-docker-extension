export const getBase64EncodedFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result;
      resolve(base64String);
    };

    reader.onerror = (error) => reject(error);

    reader.readAsDataURL(file);
  });
};

/**
 * Gets the raw b64 file and convert it to uint8Array
 *
 * @param {string} dataUrl
 * @returns {number[]} - return array of uint8Array
 */
export const getUnit8ArrayDecodedFile = (dataUrl) => {
  // Extract base64 content
  const [, base64Content] = dataUrl.split(";base64,");
  // Decode base64 content
  const decodedContent = atob(base64Content);
  // Convert decoded content to Uint8Array directly
  const uint8Array = Uint8Array.from(decodedContent, (char) =>
    char.charCodeAt(0),
  );
  return Array.from(uint8Array);
};

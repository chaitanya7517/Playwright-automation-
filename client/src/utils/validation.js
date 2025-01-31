// client/src/utils/validation.js
export const isValidFolderName = (folderName) => {
    const regex = /^[a-zA-Z0-9 _-]+$/;
    return regex.test(folderName);
  };
  
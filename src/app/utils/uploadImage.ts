
import imageKt from "../config/imageKit";

 export interface UploadImageResponse {
    url: string;
    fileId: string;
    name: string;
    thumbnailUrl: string;
}


const uploadImage = (file: string, fileName : string, folder: string): Promise<UploadImageResponse> => {
  return new Promise((resolve, reject) => {
    imageKt.upload(
      {
        file,
        fileName,
        folder: folder,
      },
      (err, result) => {
        if (err) {
          return reject(err.message);
        } else  {
            const response: UploadImageResponse = {
                url: result?.url as string,
                fileId: result?.fileId as string,
                name: result?.name as string,
                thumbnailUrl: result?.thumbnailUrl as string
            };
            return resolve(response);
        }
      }
    );
  });
};

const deleteImage = (fileId: string) => {
  return new Promise((resolve, reject) => {
    imageKt.deleteFile(fileId, (err, result) => {
      if (err) {
        return reject(err.message);
      } else {
        return resolve(result);
      }
    });
  });
};

export {
  uploadImage,
  deleteImage
};
import { useMutation } from '@tanstack/react-query';
import { HttpStatusCode } from 'axios';
import { DocumentPickerAsset } from 'expo-document-picker';
import {
  createUploadTask,
  FileSystemUploadResult,
  FileSystemUploadType
} from 'expo-file-system';

import { api_url } from './api-links';

interface UploadFileProps {
  file: DocumentPickerAsset;
  userId: string;
  groupId: number;
  label: string;
  notes: string;
}

const uploadFile = async ({
  file,
  userId,
  groupId,
  label,
  notes
}: UploadFileProps): Promise<FileSystemUploadResult | undefined> => {
  const uploadResumable = createUploadTask(
    `${api_url}/files/upload`,
    file.uri,
    {
      httpMethod: 'POST',
      uploadType: FileSystemUploadType.MULTIPART,
      fieldName: 'file_data',
      parameters: {
        upload_by: userId,
        group_id: groupId.toString(),
        label_name: label,
        notes: notes
      }
    }
  );

  return await uploadResumable.uploadAsync();
};

export const useFile = () => {
  const { mutate: uploadFileMutation } = useMutation({
    mutationFn: (fileUploadProps: UploadFileProps) =>
      uploadFile(fileUploadProps),
    onSuccess: (result) => {
      // This is needed for file upload since it seems to use fetch instead of axios
      // axios results in error if the status is 400+
      if (result && result.status === HttpStatusCode.Ok) {
        console.log('File Uploaded...');
        return;
      }
      console.log('Failed to Upload File...');
    },
    onError: (error) => {
      console.log('Server Error: ', error.message);
    }
  });

  return {
    uploadFileMutation
  };
};

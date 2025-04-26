import React from 'react';
import { FolderOpen } from 'lucide-react';
import useFileStore from '../../store/fileStore';
import useFolderStore from '../../store/folderStore';
import FileItem from './FileItem';
import { getFolderName } from '../../utils/fileHelpers';

const FileGrid = () => {
  const { getFilteredFiles } = useFileStore();
  const { getSubFolders, setCurrentFolder } = useFolderStore();
  const filteredFiles = getFilteredFiles();
  const subFolders = getSubFolders();

  return (
    <div className="p-4 overflow-y-auto">
      {/* Subfolders Grid */}
      {subFolders.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Folders</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {subFolders.map(folder => (
              <div
                key={folder}
                className="p-3 border rounded bg-white shadow-sm hover:shadow cursor-pointer flex items-center"
                onClick={() => setCurrentFolder(folder)}
              >
                <FolderOpen size={20} className="text-yellow-500 mr-2" />
                <span className="truncate">{getFolderName(folder)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Files Grid */}
      <h3 className="text-sm font-medium text-gray-500 mb-2">Files</h3>
      {filteredFiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredFiles.map(file => (
            <FileItem key={file.id} file={file} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          No files found in this location.
        </div>
      )}
    </div>
  );
};

export default FileGrid;
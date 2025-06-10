// This is a mock file service for demo purposes
// In a real app, this would connect to a database or API

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  size: number;
  mimeType?: string;
  createdAt: string;
  modifiedAt: string;
  starred?: boolean;
  shared?: boolean;
  trashed?: boolean;
  url?: string; // URL ảnh thumbnail nếu có
}

// Mock data
const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'Documents',
    type: 'folder',
    path: '',
    size: 0,
    createdAt: '2023-01-15T10:30:00Z',
    modifiedAt: '2023-04-20T14:25:00Z',
  },
  {
    id: '2',
    name: 'Images',
    type: 'folder',
    path: '',
    size: 0,
    createdAt: '2023-02-10T09:15:00Z',
    modifiedAt: '2023-05-05T11:40:00Z',
  },
  {
    id: '3',
    name: 'Project Files',
    type: 'folder',
    path: '',
    size: 0,
    createdAt: '2023-03-22T16:45:00Z',
    modifiedAt: '2023-06-12T08:20:00Z',
    starred: true,
  },
  {
    id: '4',
    name: 'Resume.pdf',
    type: 'file',
    path: '',
    size: 1024 * 500, // 500 KB
    mimeType: 'application/pdf',
    createdAt: '2023-04-05T13:10:00Z',
    modifiedAt: '2023-04-05T13:10:00Z',
    starred: true,
  },
  {
    id: '5',
    name: 'Profile Picture.jpg',
    type: 'file',
    path: '',
    size: 1024 * 1024 * 2.5, // 2.5 MB
    mimeType: 'image/jpeg',
    createdAt: '2023-05-18T10:05:00Z',
    modifiedAt: '2023-05-18T10:05:00Z',
  },
  {
    id: '6',
    name: 'Project Proposal.docx',
    type: 'file',
    path: '',
    size: 1024 * 750, // 750 KB
    mimeType: 'application/msword',
    createdAt: '2023-06-02T15:30:00Z',
    modifiedAt: '2023-06-10T09:45:00Z',
    shared: true,
  },
  // Documents folder contents
  {
    id: '7',
    name: 'Work',
    type: 'folder',
    path: '/Documents',
    size: 0,
    createdAt: '2023-01-20T11:25:00Z',
    modifiedAt: '2023-04-22T16:30:00Z',
  },
  {
    id: '8',
    name: 'Personal',
    type: 'folder',
    path: '/Documents',
    size: 0,
    createdAt: '2023-01-25T14:15:00Z',
    modifiedAt: '2023-03-15T10:20:00Z',
  },
  {
    id: '9',
    name: 'Budget 2023.xlsx',
    type: 'file',
    path: '/Documents',
    size: 1024 * 350, // 350 KB
    mimeType: 'application/vnd.ms-excel',
    createdAt: '2023-02-05T09:40:00Z',
    modifiedAt: '2023-05-10T13:55:00Z',
  },
  // Images folder contents
  {
    id: '10',
    name: 'Vacation',
    type: 'folder',
    path: '/Images',
    size: 0,
    createdAt: '2023-02-15T10:30:00Z',
    modifiedAt: '2023-02-15T10:30:00Z',
  },
  {
    id: '11',
    name: 'Beach.jpg',
    type: 'file',
    path: '/Images',
    size: 1024 * 1024 * 3.2, // 3.2 MB
    mimeType: 'image/jpeg',
    createdAt: '2023-02-20T16:45:00Z',
    modifiedAt: '2023-02-20T16:45:00Z',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=400',
  },
  {
    id: '12',
    name: 'Mountains.jpg',
    type: 'file',
    path: '/Images',
    size: 1024 * 1024 * 2.8, // 2.8 MB
    mimeType: 'image/jpeg',
    createdAt: '2023-03-05T12:10:00Z',
    modifiedAt: '2023-03-05T12:10:00Z',
    starred: true,
    url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=400',
  },
  // Project Files folder contents
  {
    id: '13',
    name: 'Design',
    type: 'folder',
    path: '/Project Files',
    size: 0,
    createdAt: '2023-03-25T09:20:00Z',
    modifiedAt: '2023-06-01T14:35:00Z',
  },
  {
    id: '14',
    name: 'Code',
    type: 'folder',
    path: '/Project Files',
    size: 0,
    createdAt: '2023-04-10T11:50:00Z',
    modifiedAt: '2023-06-05T16:25:00Z',
  },
  {
    id: '15',
    name: 'Project Timeline.pdf',
    type: 'file',
    path: '/Project Files',
    size: 1024 * 650, // 650 KB
    mimeType: 'application/pdf',
    createdAt: '2023-05-15T13:40:00Z',
    modifiedAt: '2023-06-10T10:15:00Z',
    shared: true,
  },
  // Trash items
  {
    id: '16',
    name: 'Old Notes.txt',
    type: 'file',
    path: '',
    size: 1024 * 15, // 15 KB
    mimeType: 'text/plain',
    createdAt: '2023-01-10T08:30:00Z',
    modifiedAt: '2023-01-10T08:30:00Z',
    trashed: true,
  },
  {
    id: '17',
    name: 'Archived Projects',
    type: 'folder',
    path: '',
    size: 0,
    createdAt: '2022-12-05T15:20:00Z',
    modifiedAt: '2022-12-05T15:20:00Z',
    trashed: true,
  },
];

// Get files for a specific path
export function getFiles(path: string): FileItem[] {
  return mockFiles.filter((file) => file.path === path && !file.trashed);
}

// Get shared files
export function getSharedFiles(): FileItem[] {
  return mockFiles.filter((file) => file.shared && !file.trashed);
}

// Get starred files
export function getStarredFiles(): FileItem[] {
  return mockFiles.filter((file) => file.starred && !file.trashed);
}

// Get files in trash
export function getTrashFiles(): FileItem[] {
  return mockFiles.filter((file) => file.trashed);
}

// Get a specific file by ID
export function getFileById(id: string): FileItem | undefined {
  return mockFiles.find((file) => file.id === id);
}

// Lấy contents (folders, files) trong drive hoặc trong 1 folder cụ thể
import { apiAuth } from "@/lib/axios-instance";

export async function getDriveContents({
  limit = 20,
  page = 1,
  sortOrder = "desc",
  sortField = "createdAt",
  search = "",
  parentId = "",
  headers = undefined
}: {
  limit?: number;
  page?: number;
  sortOrder?: string;
  sortField?: string;
  search?: string;
  parentId?: string;
  headers?: Record<string, string>;
} = {}) {
  const params: Record<string, unknown> = {
    limit,
    page,
    sortOrder,
    sortField,
  };
  if (search) params.search = search;
  if (parentId) params.parentId = parentId;
  const res = await apiAuth.get("/api/drive/contents", { params, headers });
  return res.data;
}

// In a real app, you would have functions to:
// - Create files and folders
// - Update files and folders
// - Delete files and folders
// - Share files and folders
// - Star/unstar files and folders
// - Move files and folders to trash
// - Restore files and folders from trash
// - Permanently delete files and folders

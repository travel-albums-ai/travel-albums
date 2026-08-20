import { Bookmark, Building, Eye, EyeClosed, Folder, FolderClock, Heart, Map, MessageSquareText, SquareLibrary, Star, Tag, Timeline, Trash, Users } from 'lucide-react';

export const routeIcons: Record<string, React.ReactElement> = {
  '/allPhotos': <SquareLibrary size={16} />,
  '/selectedPhotos/:type_name/:id': <SquareLibrary size={16} />,
  '/selectedType/:type_name': <SquareLibrary size={16} />,
}
export const sectionIcons: Record<string, React.ReactElement> = {
  'peopleAndPets': <Users size={16} />,
  'cities': <Building size={ 16} />,
  'nowAndThen': <FolderClock size={16} />,
  'folders': <Folder size={16} />,
  'views': <Eye size={16} />,
  'timeline': <Timeline size={16} />,
  'likes': <Heart size={16} />,
  'comments': <MessageSquareText size={16} />,
  'favorites': <Star size={16} />,
  'countries': <Map size={16} />,
  'ignored': <Trash size={16} />,
  'private': <EyeClosed size={16} />,
  'selected': <SquareLibrary size={16} />,
  'tags': <Tag size={16} />,
  'labels': <Bookmark size={16} />
}

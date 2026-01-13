import { Avatar, Tooltip, Popover } from 'antd';

interface AvatarItem {
  src?: string;
  name: string;
  email?: string;
  role?: string;
}

interface AvatarGroupProps {
  avatars: AvatarItem[];
  maxCount?: number;
  size?: 'small' | 'default' | 'large';
  onClick?: (avatar: AvatarItem) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function AvatarGroup({
  avatars,
  maxCount = 4,
  size = 'default',
  onClick,
  className,
  style,
}: AvatarGroupProps) {
  const sizeMap = {
    small: 24,
    default: 32,
    large: 40,
  };

  const avatarSize = sizeMap[size];
  const displayAvatars = avatars.slice(0, maxCount);
  const hiddenAvatars = avatars.slice(maxCount);

  const getAvatarContent = (avatar: AvatarItem): string => {
    if (avatar.name) {
      return avatar.name.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const handleAvatarClick = (avatar: AvatarItem) => {
    onClick?.(avatar);
  };

  const avatarElements = displayAvatars.map((avatar, index) => (
    <Tooltip
      key={avatar.email || index}
      title={
        <div>
          <div className="font-medium">{avatar.name}</div>
          {avatar.email && (
            <div className="text-xs text-gray-400">{avatar.email}</div>
          )}
          {avatar.role && (
            <div className="text-xs text-violet-500">{avatar.role}</div>
          )}
        </div>
      }
      placement="top"
    >
      <Avatar
        src={avatar.src}
        size={avatarSize}
        style={{
          cursor: onClick ? 'pointer' : 'default',
          border: '2px solid white',
          marginLeft: index > 0 ? -avatarSize * 0.3 : 0,
        }}
        onClick={() => handleAvatarClick(avatar)}
      >
        {!avatar.src && getAvatarContent(avatar)}
      </Avatar>
    </Tooltip>
  ));

  const hiddenContent = (
    <div className="py-2">
      <div className="font-medium text-sm mb-2">
        更多成员 ({hiddenAvatars.length})
      </div>
      <div className="space-y-1">
        {hiddenAvatars.map((avatar, index) => (
          <div
            key={avatar.email || index}
            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
            onClick={() => handleAvatarClick(avatar)}
          >
            <Avatar src={avatar.src} size={24}>
              {!avatar.src && getAvatarContent(avatar)}
            </Avatar>
            <div className="flex-1">
              <div className="text-sm font-medium">{avatar.name}</div>
              {avatar.email && (
                <div className="text-xs text-gray-400">{avatar.email}</div>
              )}
              {avatar.role && (
                <div className="text-xs text-violet-500">{avatar.role}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const moreElement = hiddenAvatars.length > 0 && (
    <Popover content={hiddenContent} trigger="click" placement="bottomLeft">
      <Avatar
        size={avatarSize}
        style={{
          backgroundColor: '#f3f4f6',
          color: '#6b7280',
          border: '2px solid white',
          marginLeft: -avatarSize * 0.3,
          cursor: 'pointer',
        }}
      >
        +{hiddenAvatars.length}
      </Avatar>
    </Popover>
  );

  return (
    <div
      className={`flex items-center ${className || ''}`}
      style={style}
    >
      {avatarElements}
      {moreElement}
    </div>
  );
}

interface AvatarListProps extends Omit<AvatarGroupProps, 'maxCount'> {
  onItemClick?: (avatar: AvatarItem) => void;
}

export function AvatarList({
  avatars,
  size = 'default',
  onClick,
  className,
  style,
}: AvatarListProps) {
  const sizeMap = {
    small: 24,
    default: 32,
    large: 40,
  };

  const avatarSize = sizeMap[size];

  const getAvatarContent = (avatar: AvatarItem): string => {
    if (avatar.name) {
      return avatar.name.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className={`space-y-3 ${className || ''}`} style={style}>
      {avatars.map((avatar, index) => (
        <div
          key={avatar.email || index}
          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
          onClick={() => onClick?.(avatar)}
        >
          <Avatar src={avatar.src} size={avatarSize}>
            {!avatar.src && getAvatarContent(avatar)}
          </Avatar>
          <div className="flex-1">
            <div className="font-medium text-gray-900">{avatar.name}</div>
            {avatar.email && (
              <div className="text-sm text-gray-500">{avatar.email}</div>
            )}
            {avatar.role && (
              <div className="text-sm text-violet-500">{avatar.role}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

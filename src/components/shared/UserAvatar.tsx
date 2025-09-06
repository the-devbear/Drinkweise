import { cn } from '@drinkweise/lib/cn';
import { getUserInitials } from '@drinkweise/lib/utils/get-user-initials';
import { Avatar, AvatarFallback, AvatarImage } from '@drinkweise/ui/Avatar';
import { Text } from '@drinkweise/ui/Text';
import { useMemo } from 'react';

interface UserAvatarProps {
  className?: string;
  avatarClassName?: string;
  fallbackClassName?: string;
  userInitialsClassName?: string;
  username: string;
  avatarUrl?: string;
}

export function UserAvatar({
  className,
  avatarClassName,
  fallbackClassName,
  userInitialsClassName,
  username,
  avatarUrl,
}: UserAvatarProps) {
  const userInitials = useMemo(() => getUserInitials(username), [username]);

  return (
    <Avatar className={cn('h-16 w-16', className)} alt={username}>
      {!!avatarUrl ? (
        <AvatarImage className={avatarClassName} source={{ uri: avatarUrl }} />
      ) : null}
      <AvatarFallback className={cn('bg-primary text-white', fallbackClassName)}>
        <Text className={cn('', userInitialsClassName)}>{userInitials}</Text>
      </AvatarFallback>
    </Avatar>
  );
}

import Image from 'next/image';

interface UserAvatarProps {
  src: string | null | undefined;
  alt: string;
  size?: number;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ src, alt, size = 30 }) => {
  return (
    <Image
      src={src || '/placeholder-avatar.jpg'}
      alt={alt}
      width={size}
      height={size}
      className="rounded-full"
    />
  );
};

export default UserAvatar;
interface SoundCloudEmbedProps {
  url: string;
}

const SoundCloudEmbed: React.FC<SoundCloudEmbedProps> = ({ url }) => {
  return (
    <iframe
      width="100%"
      height="166"
      scrolling="no"
      frameBorder="no"
      allow="autoplay"
      src={`https://w.soundcloud.com/player/?url=${url}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
    ></iframe>
  );
};

export default SoundCloudEmbed;
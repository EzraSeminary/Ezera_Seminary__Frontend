export const getYoutubeVideoId = (url: string) => {
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };
  
  export const getYoutubeThumbnailUrl = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/0.jpg`;
  };
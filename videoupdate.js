<script>
fetch('videos.json')
  .then(response => response.json())
  .then(data => {
    const track = document.getElementById('video-track');

    data.videos.forEach(video => {
      const card = document.createElement('div');
      card.className = 'video-card';

      const iframe = document.createElement('iframe');
      iframe.src = video.url;
      iframe.frameBorder = "0";
      iframe.allowFullscreen = true;

      card.appendChild(iframe);
      track.appendChild(card);
    });

    // Duplicate for seamless infinite scroll
    track.innerHTML += track.innerHTML;
  })
  .catch(error => console.error('Error loading videos:', error));
</script>

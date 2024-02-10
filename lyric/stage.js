function renderSlide(host) {
  fetch(`http://${host}:4316/api/v2/controller/live-item`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const template = document.getElementById('template').innerHTML;
      const rendered = Mustache.render(template, data);
      document.getElementById('template-container').innerHTML = rendered;
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const host = window.location.hostname;
  const websocket_port = 4317;
  renderSlide(host);
  
  ws = new WebSocket(`ws://${host}:${websocket_port}`);
  ws.onmessage = (event) => {
    const reader = new FileReader();
    reader.onload = () => {
      const state = JSON.parse(reader.result.toString()).results;

      console.log(state);
      renderSlide(host);
    };
    reader.readAsText(event.data);
  };
});


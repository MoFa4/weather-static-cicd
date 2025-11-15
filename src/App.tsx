.app-container {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.app-container::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: #6a11cb center/cover no-repeat;
  background-size: cover;
  background-attachment: fixed;
  z-index: -1;
  transition: background 1.8s ease-in-out;
}

/* DYNAMIC BACKGROUNDS — WITH CACHE BUST */
.bg-hot::before    { background: url('https://images.unsplash.com/photo-1542382157939-5c5d2d5b5c5f?auto=format&fit=crop&q=80') center/cover no-repeat fixed; }
.bg-sunny::before  { background: url('https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80') center/cover no-repeat fixed; }
.bg-cloudy::before { background: url('https://images.unsplash.com/photo-1492011221367-f47e3ccd77a0?auto=format&fit=crop&q=80') center/cover no-repeat fixed; }
.bg-rain::before   { background: url('https://images.unsplash.com/photo-1534086721723-4d4d5c3a36a6?auto=format&fit=crop&q=80') center/cover no-repeat fixed; }
.bg-snow::before   { background: url('https://images.unsplash.com/photo-1477603566046-945b3c7b3d6c?auto=format&fit=crop&q=80') center/cover no-repeat fixed; }

/* Fallback */
.bg-default::before { background: linear-gradient(135deg, #6a11cb, #2575fc); }

/* GLASS CARD */
.weather-card {
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 24px;
  padding: 32px;
  max-width: 420px;
  margin: 40px auto;
  border: 1px solid rgba(255,255,255,0.3);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}

.overlay { position: relative; z-index: 2; text-align: center; padding: 20px; }

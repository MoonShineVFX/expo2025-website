import "./App.css";

function App() {
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <header className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">非常感謝您</h1>
        <p className="text-xl md:text-2xl mb-2">讓我們有機會分享</p>
        <p className="text-xl md:text-2xl">這個美麗的島嶼。</p>
      </header>

      {/* Intro Section */}
      <section className="py-16 px-4 bg-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold">您的3套行程推薦</h2>
      </section>

      {/* Itinerary Sections */}
      {[1, 2, 3].map((num) => (
        <section key={num} className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            行程 {String(num).padStart(2, "0")}
          </h2>
          <div className="aspect-video w-full mb-8">
            <video
              className="w-full h-full object-cover rounded-lg shadow-lg"
              controls
            >
              <source src={`/path-to-video${num}`} type="video/mp4" />
            </video>
          </div>
          <div className="prose max-w-none md:prose-lg mx-auto">
            <p>行程 {num} 內文描述</p>
          </div>
        </section>
      ))}

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-50 text-center">
        <p className="text-gray-600">製作單位 103fm06</p>
      </footer>
    </div>
  );
}

export default App;

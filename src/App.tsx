import  { useState } from "react";

function App() {
    const [theme, setTheme] = useState("light");

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-base-200 p-6">
            {/* Navbar */}
            <div className="navbar bg-base-100 shadow-lg rounded-lg w-full max-w-4xl">
                <div className="flex-1">
                    <a className="btn btn-ghost normal-case text-xl text-primary">🚀 My DaisyUI App</a>
                </div>
                <div className="flex-none">
                    <button className="btn btn-outline" onClick={toggleTheme}>
                        {theme === "light" ? "🌙 Dark Mode" : "☀ Light Mode"}
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <div className="text-center my-10">
                <h1 className="text-5xl font-bold text-primary">Welcome to DaisyUI!</h1>
                <p className="py-4 text-lg text-gray-600">
                    This is a simple welcome page to check if DaisyUI is properly installed.
                </p>
                <button className="btn btn-primary">Get Started</button>
            </div>

            {/* Card Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card w-80 bg-base-100 shadow-xl">
                    <figure>
                        <img
                            src="https://source.unsplash.com/300x200/?technology"
                            alt="Tech"
                        />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">Tech News</h2>
                        <p>Stay updated with the latest technology trends.</p>
                        <div className="card-actions justify-end">
                            <button className="btn btn-primary">Learn More</button>
                        </div>
                    </div>
                </div>

                <div className="card w-80 bg-base-100 shadow-xl">
                    <figure>
                        <img
                            src="https://source.unsplash.com/300x200/?coding"
                            alt="Coding"
                        />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">Coding Tips</h2>
                        <p>Improve your coding skills with expert tips.</p>
                        <div className="card-actions justify-end">
                            <button className="btn btn-secondary">Explore</button>
                        </div>
                    </div>
                </div>

                <div className="card w-80 bg-base-100 shadow-xl">
                    <figure>
                        <img
                            src="https://source.unsplash.com/300x200/?design"
                            alt="Design"
                        />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">UI/UX Design</h2>
                        <p>Discover best practices for UI/UX design.</p>
                        <div className="card-actions justify-end">
                            <button className="btn btn-accent">Read More</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;

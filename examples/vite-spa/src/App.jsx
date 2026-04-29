function Header() {
    return (
        <header>
            <h1>Karel IV. žil v 14. století</h1>
        </header>
    );
}

function Body() {
    return (
        <p>
            Šel jsem k autu a v domě jsem našel knihu od J. R. R. Tolkiena. Cestoval Karel IV. po
            cestě dlouhé 5 km. Bylo to 5. 12. 2024 a teplota byla 30 °C.
        </p>
    );
}

export default function App() {
    return (
        <main style={{ maxWidth: 720, margin: '4rem auto', padding: '0 1rem' }}>
            <Header />
            <Body />
        </main>
    );
}

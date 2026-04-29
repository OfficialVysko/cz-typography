import { fixCzech } from 'cz-typography';
import { Typo, TypoWrapper } from 'cz-typography/react';

async function getPost() {
    return {
        title: 'Karel IV. žil v 14. století',
        body: '<p>Cestoval z Prahy přes Norimberk a do Říma. Měl k tomu 5 km cestu.</p>',
    };
}

export default async function Page() {
    const post = await getPost();

    return (
        <main style={{ maxWidth: 720, margin: '4rem auto', padding: '0 1rem' }}>
            <h1>cz-typography – Next.js App Router example</h1>

            <section>
                <h2>1. Whole-website middleware (this paragraph too)</h2>
                <p>
                    Šel jsem k autu a v domě jsem našel knihu od J. R. R. Tolkiena. Cestoval Karel
                    IV. po cestě dlouhé 5 km. Bylo to 5. 12. 2024.
                </p>
            </section>

            <section>
                <h2>2. &lt;Typo&gt; server component</h2>
                <Typo>
                    <article>
                        <h3>{post.title}</h3>
                        <div dangerouslySetInnerHTML={{ __html: post.body }} />
                    </article>
                </Typo>
            </section>

            <section>
                <h2>3. &lt;TypoWrapper&gt; client component</h2>
                <TypoWrapper>
                    <p>v domě a v práci je 5 km a 30 °C.</p>
                </TypoWrapper>
            </section>

            <section>
                <h2>4. fixCzech runtime utility</h2>
                <p>{fixCzech(`Cena je 10 000 Kč k dispozici.`)}</p>
            </section>
        </main>
    );
}

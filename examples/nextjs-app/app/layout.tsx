export const metadata = {
    title: 'cz-typography – Next.js example',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="cs">
            <body>{children}</body>
        </html>
    );
}

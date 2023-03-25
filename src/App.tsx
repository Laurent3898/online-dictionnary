import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import DarkModeToggle from './components/DarkModeToggle';
import Words from './components/Words';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App(): JSX.Element {
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');
  const [searchWord, setSearchWord] = React.useState<string>('');
  const [word, setWord] = React.useState<string>('');

  React.useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setWord(searchWord);
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  return (
    <QueryClientProvider client={queryClient}>
      <main
        className={`flex flex-col h-screen font-sans subpixel-antialiased bg-gray-100 dark:bg-gray-900 dark:text-gray-50 text-gray-900 ${
          theme === 'dark' ? 'dark' : ''
        } bg-customized`}
      >
        <nav className="flex flex-wrap items-center justify-center md:justify-between py-6 px-6 md:px-12 bg-inherit dark:bg-gray-900 dark:text-gray-50 text-gray-900 ">
          <div className="flex flex-row items-end mr-6 justify-end ">
            <h1 className="text-xl text-slate-900 dark:text-gray-50 pb-1 font-bold first-letter:uppercase">
              Dictionary
            </h1>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-wrap justify-between"
          >
            <div className="rounded-lg bg-gradient-to-r from-orange-600 via-red-500 to-cyan-500 p-0.5  ml-2">
              <input
                className="w-full max-w-3xl sm:max-w-2xl rounded-md py-2 px-4  focus:outline-none focus:shadow-outline dark:bg-gray-800 bg-gray-50 appearance-none leading-normaL input-text"
                type="text"
                value={searchWord}
                placeholder="Type any word..."
                onChange={(e) => setSearchWord(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-2"
            >
              Search
            </button>
          </form>
          <div className="flex items-center">
            <DarkModeToggle theme={theme} setTheme={setTheme} />
          </div>
        </nav>
        <Words word={word} />
        <ReactQueryDevtools />
        <footer
          className={` bg-gray-100 dark:bg-gray-900 dark:text-gray-50 text-gray-900 bg-customized`}
        >
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <p className="text-neutral-700 dark:text-slate-50">
              copyright &copy;{' '}
              <b>
                <span className="variantbluecolor">{currentYear}</span> Laurent
                R.
              </b>
            </p>
          </div>
        </footer>
      </main>
    </QueryClientProvider>
  );
}

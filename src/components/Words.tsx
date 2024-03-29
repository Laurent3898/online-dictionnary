import axios from 'axios';
import { Definition, Meaning, Phonetic, Word } from '../types/types';
import { useQuery } from 'react-query';
import Loading from './Loading';
import Fetching from './Fetching';

interface Props {
  word: string;
}

export default function Words({ word }: Props): JSX.Element {
  const { isLoading, data, error, isFetching } = useQuery<Word>(
    ['words', word],
    async () => {
      const response = await axios.get<Word[]>(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      return response.data[0];
    },
    {
      enabled: Boolean(word),
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      // Only fetch when `word` is truthy
    }
  );

  if (!word) {
    return (
      <div className="h-screen bg-white dark:bg-gray-900 flex justify-center items-center bg-customized">
        <p className="text-gray-800 dark:text-gray-50 text-lg">
          Search your word
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-screen bg-white dark:bg-gray-900 flex justify-center items-center bg-customized">
        <Loading/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-white dark:bg-gray-900 flex justify-center items-center bg-customized">
        <p className="text-rose-500 text-lg p-5 text-center">
          Sorry, there was an error fetching the word. Please try again later.
        </p>
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="h-screen bg-slate-700 dark:bg-gray-900 flex justify-center items-center bg-customized">
        <Fetching/>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 dark:text-gray-50 px-12 flex-1 pb-4 bg-customized">
      <h1 className="text-5xl mb-2">{data?.word}</h1>

      <div className="">
        <h4>
          <b>Pronunciation</b>
        </h4>
        {data?.phonetics.map((phonetic: Phonetic, index: number) => (
          <>
            <ul key={index} className="list-disc ml-4">
              <li className="circleCheckmark text-sky-700">{phonetic.text}</li>
            </ul>
          </>
        ))}

        {data?.meanings.map((meaning: Meaning) => (
          <div key={meaning.partOfSpeech} className="mt-4">
            <h2 className="font-bold capitalize border-b border-gray-800 pb-2 italic">
              {meaning.partOfSpeech}
            </h2>

            {meaning.definitions?.map(({ definition }: Definition) => (
              <ul key={definition} className="list-disc ml-4 mt-2">
                <li className="">{definition}</li>
              </ul>
            ))}
          </div>
        ))}

        {data?.sourceUrls.map((sourceUrl: string, index: number) => (
          <div key={index} className="mt-4 decoration-sky-500">
            Source:{' '}
            <a className="underline text-cyan-900 decoration-teal-500" href={sourceUrl}>
              {sourceUrl}
            </a>
          </div>
        ))}

        {data?.license.url && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Powered by {data?.license.name} -{' '}
              <a
                href={`${data?.license.url}`}
                className="underline decoration-pink-500/30"
                target="_blank"
              >
                {data?.license.url}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

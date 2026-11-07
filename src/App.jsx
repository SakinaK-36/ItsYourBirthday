import { useEffect, useState } from 'react';
import { Intro } from './components/Intro';
import { Navbar } from './components/Navbar';
import { LoveLetter } from './components/LoveLetter';
import { Gallery } from './components/Gallery';
import { Scrapbook } from './components/Scrapbook';
import { Reasons } from './components/Reasons';
import { Timeline } from './components/Timeline';
import { OpenWhen } from './components/OpenWhen';
import { MusicCorner } from './components/MusicCorner';
import { BucketList } from './components/BucketList';
import { Celebration } from './components/Celebration';
import { FinalSurprise } from './components/FinalSurprise';
import { Footer } from './components/Footer';
import { StorageWarning } from './components/StorageWarning';
import { CreatorTools } from './components/CreatorTools';

export default function App() {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (!opened) return undefined;
    const timer = window.setTimeout(() => {
      document.getElementById('love-letter')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 180);
    return () => window.clearTimeout(timer);
  }, [opened]);

  return (
    <>
      {opened && (
        <a className="skip-link" href="#love-letter">
          Skip to the love letter
        </a>
      )}
      <Navbar opened={opened} />
      <Intro onOpen={() => setOpened(true)} />

      {opened && (
        <main className="site-main">
          <LoveLetter />
          <Gallery />
          <Scrapbook />
          <Reasons />
          <Timeline />
          <OpenWhen />
          <MusicCorner />
          <BucketList />
          <Celebration />
          <FinalSurprise />
        </main>
      )}

      {opened && <Footer />}
      <StorageWarning />
      <CreatorTools />
    </>
  );
}

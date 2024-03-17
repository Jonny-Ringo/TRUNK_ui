import { useEffect, useState } from 'react';
import { dryrun } from "@permaweb/aoconnect";

import Footer from './Footer';

const TRUNK = "OT9qTE2467gcozb2g8R6D6N3nQS94ENcaAIJfUzHCww"
const INITIAL_FRAME = "X5TgFGNgbje0JezztY5RL__VnYD9IieHa_9n9p0dMb0"

function Home () {
    const [iframeSrc, setIframeSrc] = useState('');

    useEffect(() => {
        const getWebsite = async () => {
          try {
            const result = await dryrun({
              process: TRUNK,
              tags: [{ name: 'Action', value: "Get-Frame" }]
            });
            if (result) {
              return result.Messages[0].Data;
            } else {
              console.log("Got no response from dryrun!")
              return INITIAL_FRAME
            }
          } catch (e) {
            console.log(e);
          }
        };
    
        const setupIframe = async () => {
          const processResponse = await getWebsite();
          const url = `https://arweave.net/${processResponse}`;
          setIframeSrc(url);
        };
    
        setupIframe();
      }, []);
    return (
        <div>
            <div>
                <iframe title="Meme-Ception" className="w-full h-screen" src={iframeSrc} />
            </div>
            <Footer />
        </div>
	);
}

export default Home;
